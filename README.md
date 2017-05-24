## Xml to Leo

This is a basic command-line utility for for converting various xml formats
to .leo format. Leo is an open source outlining editor.

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

To convert a document, place it in the 'input' folder, then run (example, from
terminal window in project folder):

    node 2leo.js input/myfile

Or run as command line script:

    chmod +x 2leo.js

    node 2leo.js input/myfile
    
The output files will be written to the 'output' folder.

For more options run

    node 2leo.js  --help
    
## License
 
MIT    