[![Dependency Status](https://david-dm.org/kaleguy/xml2leo.svg)](https://david-dm.org/kaleguy/xml2leo)


## Xml to Leo

This is a basic command-line utility for for converting various xml formats
to .leo format. Leo is an open source outlining editor.

Currently the only format supported is for Shakespeare's plays.

To run the Shakespeare imports:

    npm run shakespeare 

To create a new transformation type, edit the example shakespearetoleo.xsl file.

## Installation

This script uses the npm java module. In order to get this to run with more recent versions of Java,
you will need to edit the following file (on Mac):

    /Library/Java/JavaVirtualMachines/<version>.jdk/Contents/Info.plist 

Edit the above file to include the lines below:

    <key>JVMCapabilities</key>
    <array>
        ...
        <string>JNI</string>
    </array>


To install, download the project and:

    npm install
    
If you get node-gyp errors, it may be because you need to install Java.     

## Use

To convert xml files to leo format, run::

    node 2leo.js infolder outfolder xslfile

Or run as command line script:

    chmod +x 2leo.js

    ./2leo.js infolder outfolder xslfile
    

For more options run

    node 2leo.js  --help
    
Removed html-md due to inability to compile.    
    
## License
 
MIT    
