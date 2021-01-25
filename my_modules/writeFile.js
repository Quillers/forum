// fs to read and write
const fs = require('fs');
// my readfile module to get data from a file
const readfile = require('./readFile');

/*
**  WRITEFILE OBJECT 
** 
*/  

// the main objective of this object is to read the data from the JSON db file, append new data
// and rewrite everyting on the file;

const writeJSONFile = {
    fileData: undefined,
    //METHODS

    writeFile: function(filePath, dataToWrite) {
        // First we open and read From the dataBAse to get the array
        writeJSONFile.fileData = readfile.getJSONData(filePath);

        if (!writeJSONFile.fileData) {
            throw new Error("ERROR file empty");
        }

        // Then we push the new value to the array
        writeJSONFile.fileData.push(dataToWrite);

        //then we write the new data in the file
        fs.writeFileSync(filePath, JSON.stringify(writeJSONFile.fileData));
        return writeJSONFile.fileData;
    },
}

module.exports = writeJSONFile;