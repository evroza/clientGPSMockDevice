/**
 * Created by Evans R. on 4/11/2017.
 */

const fs = require('fs');

module.exports = class FileReader {
    /*
        Attempts to resolve file and throws error if file not found
     */
     constructor(inputFile){
         // Try resolving file
         var that;
         this.fileName = inputFile;
         that = this;

         return new Promise((resolve) => {
             let stats = fs.stat(inputFile, function(err,stat){
                 if (stat && stat.isFile() ){
                     that.fileName = inputFile;
                     resolve(that);
                 } else {
                     // File doesn't exist
                     console.error("The file you specified does not exist!");
                     throw new Error('FILE READ ERROR: File not found!');
                 }
             });
         });


    }

    /**
     * Returns an array of lines
     * Has to be asynchrous because constructor is asynchronous
     */
    getLinesArr(){
        let linesArr = [];

        return new Promise((resolve) => {
            if(!this.fileName){
                //file doesn't exist
                console.error('The file passed to reader doesn\'t exist. Couldn\'t fetch lines');
                throw new Error('LINE READ ERROR: File path incorrect')
            } else {
                let lineReader = require('readline').createInterface({
                    input: fs.createReadStream(this.fileName)
                });

                // add each line to our object array
                lineReader.on('line', function (line) {
                    linesArr.push(line);
                });

                lineReader.on('close', function () {
                    console.log('File read status: Read complete');
                    resolve(linesArr);
                });


            }
        });
    }



};