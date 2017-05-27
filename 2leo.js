#!/usr/local/bin/node

var Converter = require('./import');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

if (argv.help){
  displayHelp();
}

function displayHelp(){
    console.log(`
    Script to convert xml files to leo format. Converts all xml files in
    input folder into leo files in output folder.

    Required parameters:
    indir: the folder where the input xml files are
    outdir: the folder you want the output files to go into
    xslfile: the xsl file that specifies the transformation rules

    Usage: node 2leo.js indir outdir xslfile

    Or, to run at command line, check first line of 2leo.js and
    then run ./2leo.js indir outdir

    Options:
      --help: this message
    `);
    process.exit(0);
}

var indir = (argv._[0]);
if (! indir){
    console.log("\n=== No input folder specified! More info about this program:");
    displayHelp();
    process.exit(0);
}
var outdir = (argv._[1]);
if (! outdir ){
    console.log("\n=== No output folder specified! More info about this program:");
    displayHelp();
    process.exit(0);
}
var xslfile = (argv._[2]);
if (! xslfile ){
    console.log("\n=== No input folder specified! More info about this program:");
    displayHelp();
    process.exit(0);
}
var converter = new Converter(argv);

fs.stat(indir, (err, stat) => {
    if(err == null) {
        converter.init(xslfile).then(() => {
            converter.importFolder(indir, outdir);
        })
    } else {
        console.log('Invalid input folder: ' + '\n\n', err);
        process.exit();
    }
});


