const fs = require('fs');
/*
**  READFILE OBJECT 
** 
*/

const readJSONFile = {
    // content of
    fileData: null,

    //METHODS

    readFile: function (filePath) {
        //checking if file exist or throw an error
        if (!fs.existsSync(filePath))
            throw new Error(`readFileSyncError:` + filePath + ` does not exists`);

        //we read the jason file to get the data
        let rawData = fs.readFileSync(filePath, /*{ encoding: 'utf8' }*/);

        // We check if the file is empty or not
        if (!rawData.toString()) {

            // then we set the content to en empty array
            readJSONFile.fileData = [];
        } else {
            //else we parse it from json to a js object
            readJSONFile.fileData = JSON.parse(rawData);
        }


    },

    getJSONData: function (filePath) {
        //we get the data from file
        readJSONFile.readFile(filePath);
        //we then send it back;
        return readJSONFile.fileData;
    }
}

module.exports = readJSONFile;