/**
 * Created by Evans R. on 4/11/2017.
 */

const fs = require('fs');
const lineReader = require('readline');

module.exports = class FileReader {
        /*
            Attempts to resolve file and throws error if file not found
         */
        constructor(inputFile){
            this.fileName = null;
            //Ensure file exists
            let stats = fs.stat(this.fileName, function(err,stat){
                if (stat && stat.isFile() ){
                    this.fileName = inputFile;
                } else {
                    // File doesn't exist
                    console.error("The file you specified does not exist!");
                    throw new Error('FILE READ ERROR: File not found!');
                }
            });
        }

    /**
     * Returns an array of lines
     */
    getLinesArr(){
        let linesArr = [];

        if(!this.fileName){
            //file doesn't exist
            console.error('The file passed to reader doesn\'t exist. Couldn\'t fetch lines');
            throw new Error('LINE READ ERROR: File path incorrect')
        } else {
            lineReader.createInterface({
                input: fs.createReadStream(this.fileName)
            });

            // add each line to our object array
            lineReader.on('line', function (line) {
                linesArr.push(line);
            });

            lineReader.on('close', function () {
                console.log('File read status: Read complete');
            });

            return linesArr;
        }


    }
};