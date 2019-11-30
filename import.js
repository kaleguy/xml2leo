'use strict';

let outputDir = 'output'; // default

const path = require('path');
const xslt4node = require('xslt4node');
const fs = require('fs-extra');
const DOMParser = require('xmldom').DOMParser;
const XMLSerializer = require('xmldom').XMLSerializer;
const _ = require('lodash');
// const mv = require('mv');
// const md = require('html-md');
let config = {};

/**
 * Constructor
 * @param {object} options - config options
 * @returns {Convert}
 * @constructor
 */
function Convert(options) {
    if (!(this instanceof Convert)) {
        return new Convert(options);
    }
    config = options;
}

/**
 * Set up object: read in XSL for transforms
 */
Convert.prototype.init = function (xslfile) {
    const p = new Promise((resolve, reject) => {
        fs.readFile(process.cwd() + "/" + xslfile + ".xsl", (err, data) => {
            if (err) {
                return console.error(err);
            }
            this.XML2HTML = new DOMParser().parseFromString(data.toString());
            if (!this.XML2HTML) {
                console.log('Unable to process XSL file');
                process.exit();
                reject();
            }
            this.inXML = null;
            console.log('Initialized.');
            resolve();
        });
    });
    return p;
};

Convert.prototype.importFolder = function (inDir, outDir) {

    const queue = [];
    fs.readdirSync(inDir).forEach(file => {
        if (/\.xml$/.test(file)) {
            queue.push(() => this.importFile(inDir, outDir, file));
        }
    });
    queue.reduce((p, f) => p.then(f),  Promise.resolve())
         .then(() => {
           console.log('Finished');
           return process.exit(0);
         });
};

Convert.prototype.importFile = function (inDir, outDir, file) {

    const p = new Promise((resolve, reject) => {

        if (outDir) {
            outputDir = outDir;
        }

        this.inXML = null;

        fs.readFile(inDir + '/' + file, (err, data) => {
            if (err) {
                if ('ENOENT' !== err.code) {
                    console.error("addXML:", err);
                }
                if ('ENOENT' === err.code) {
                    console.log('File not found in add XML:', inDir, file);
                }
                return;
                // return callback();
            }
            let xml = new DOMParser().parseFromString(data.toString());
            this.inXML = xml;

            if (!this.XML2HTML) {
                console.log('Bad XSL file');
                reject();
                process.exit();
            }
            const xslt = new XMLSerializer().serializeToString(this.XML2HTML);
            xml = new XMLSerializer().serializeToString(this.inXML);
            const config = {
                xslt: xslt,
                source: xml,
                result: String,
                props: {
                    indent: 'yes'
                }
            };
            xslt4node.transform(config, (err, result) => {
                if (err) {
                    console.log('Error', err);
                    reject();
                }
                file = file.substring(0, file.lastIndexOf('.'));
                console.log('Writing file: ', file);
                _writeXML(result, outDir + '/' + file + '.leo')
                    .then(() => resolve())
            });

        });

        let _writeXML = (xml, filePath) => {
            return new Promise((resolve, reject) => {
                // let xmlString = new XMLSerializer().serializeToString(xml);
                fs.writeFile(filePath, xml, (err) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    console.log('Written to: ', filePath);
                    return resolve();
                });
            })
        };

    });
    return p;

};

function domListToJson(list, el) {

    if (el.tagName === 'li') {
        return list.data.push(el.textContent);
    }

    let children = el.childNodes;
    if (!children) {
        return;
    }
    let childList = {};
    childList.type = el.tagName;
    childList.data = [];
    if (list) {
        list.list = childList;
    } else {
        list = childList;
    }
    _.forEach(children, (child) => {
        if (child.nodeType !== 3) {
            domListToJson(childList, child);
        }
    });
    return list;

}


module.exports = Convert;
