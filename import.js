'use strict';

let outputDir = 'output'; // default

const path = require('path');
const xslt4node = require('xslt4node');
const fs = require('fs-extra');
const DOMParser = require('xmldom').DOMParser;
const XMLSerializer = require('xmldom').XMLSerializer;
const async = require('async');
const _ = require('lodash');
const Q = require('q');
const mv = require('mv');
const Datauri = require('datauri');
const md = require('html-md');
const table = require('gfm-table');
const json = require('format-json');
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
    this.init();
    config = options;
}

/**
 * Set up object: read in XSL for transforms
 */
Convert.prototype.init = function () {
    fs.readFile(process.cwd() + "/shakespearetoleo.xsl", (err, data) => {
        if (err) {
            return console.error(err);
        }
        this.XML2HTML = new DOMParser().parseFromString(data.toString());
    });
    this.inXML = null;
    console.log('Initialized.')
};

/**
 * Main import function
 * @param {string } sourcePath - path to input docx file.
 * @param {string } outDir - output folder
 */
Convert.prototype.import = function (sourcePath, outDir) {

    if (outDir) {
        outputDir = outDir;
    }

    this.inXML = null;

    let sourceFile = {
        path: sourcePath,
        name: path.basename(sourcePath),
        dir: path.dirname(sourcePath) + '',
        extname: path.extname(sourcePath),
        basename: path.basename(sourcePath, path.extname(sourcePath))
    };
    sourceFile.outDir = outputDir + '/'; // + sourceFile.basename;

    fs.readFile(sourcePath, (err, data) => {
        if (err) {
            if ('ENOENT' !== err.code) {
                console.error("addXML:", err);
            }
            if ('ENOENT' === err.code) {
                console.log('File not found in add XML:', filePath);
            }
            return;
            // return callback();
        }
        let xml = new DOMParser().parseFromString(data.toString());
        this.inXML = xml;

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
            _writeXML(result, 'shakespeare/output_document.xml')
        });

    });

    /**
     * Need to read several XML files:
     *   the main document.xml,
     *   the rels file (which contains links to the images),
     *   the core.xml file which has properties like title etc.
     * Append one to the other, and then we can call transform.
     *
     * The next two functions perform these tasks
     * @param {string} xmlPath to xml file
     * @param {function} callback (so we can use with async library, see _getXML)
     * @private
     */
    let _addXML = (xmlPath, callback) => {
        let filePath = sourceFile.outDir + '/.tmp/' + xmlPath;
        fs.readFile(filePath, (err, data) => {
            if (err) {
                if ('ENOENT' !== err.code) {
                    console.error("addXML:", err);
                }
                if ('ENOENT' === err.code) {
                    console.log('File not found in add XML:', filePath);
                }
                return callback();
            }
            let xml = new DOMParser().parseFromString(data.toString());
            if (!this.inXML) {
                this.inXML = xml;
            } else {
                this.inXML.documentElement.appendChild(
                    this.inXML.importNode(xml.documentElement, true)
                );
            }
            callback();
        });
    };


    let _writeXML = (xml, filePath) => {
        let deferred = Q.defer();
        let xmlString = new XMLSerializer().serializeToString(xml);
        fs.writeFile(sourceFile.outDir + filePath, xmlString, (err) => {
            if (err) {
                console.log(err);
                return deferred.reject(err);
            }
            console.log('Done.');
            return deferred.resolve();
        });
        return deferred.promise;
    };

};

/**
 * Utility function, takes an array and an element, gets all
 * child data from list item nodes. Returns nested arrays
 * corresponding to the DOM subtree.
 * @param list
 * @param el
 * @returns {*}
 */
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