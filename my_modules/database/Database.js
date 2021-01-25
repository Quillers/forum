const my_readFile = require('../readFile');
const my_writeFile = require('../writeFile');
const path = require('path');



class MessageTable {
    constructor(url) {
        this.baseUrl = url;
        this.messages = my_readFile.getJSONData(url);
        this.currentId = this.messages.length;
    }
    addMessageToBase(data) {
        data.id = this.currentId;
        data.timeStamp = Date();
        this.currentId++;
        my_writeFile.writeFile(this.baseUrl, data);
    }
    getMessagesFromBase() {
        this.messages = my_readFile.getJSONData(this.baseUrl);
        return this.messages;
    }

}

const messageTable = new MessageTable( path.resolve(__dirname, './messages.json'));

module.exports = messageTable;