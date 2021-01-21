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

// console.log(messageTable.getMessagesFromBase());
// messageTable.addMessageToBase({
//     author: 'Valentin',
//     timestamp: Date(),
//     content: 'Je suis une grenouille'
// });
// console.log(messageTable.getMessagesFromBase());
// messageTable.addMessageToBase({
//     author: 'Valentin',
//     timestamp: Date(),
//     content: 'trou de balle cornu de la fesse de c\'est mort de mes cuilles'
// });
// console.log(messageTable.getMessagesFromBase());

module.exports = messageTable;