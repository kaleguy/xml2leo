#!/usr/local/bin/node

var Converter = require('./import');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

if (argv.help){
  displayHelp();
}

function displayHelp(){
    console.log(`
    Script to convert xml files to leo format.

    Usage: node 2leo.js input/myfile

    Or, to run at command line, check first line of 2leo.js and
    then run ./2leo.js path_to_file

    Options:
      --help: this message
      --outdir=path/to/output: output directory, default is 'output'
      --datauri: if true, convert image files to inline data
    `);
    process.exit(0);
}

var path = (argv._[0]);
if (! path){
    console.log("\n=== No path specified! More info about this program:");
    displayHelp();
    process.exit(0);
}
var converter = new Converter(argv);

fs.stat(path, (err, stat) => {
    if(err == null) {
        converter.import(path, argv.outdir);
    } else {
        console.log('Invalid file path: ' + path + '\n\n', err);
        process.exit();
    }
});


