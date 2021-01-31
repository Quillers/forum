const my_readFile = require('../readFile');
const my_writeFile = require('../writeFile');
const path = require('path');

/**
 * Contains all the messages from Database, one instance 
 * refresh content with the getMessage method (spoiler: inheritance)
 */

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
        this.messages = my_writeFile.writeFile(this.baseUrl, data);
    }
    getMessagesFromBase(topicId) {
        return this.messages.filter(message => message.topicId === topicId);
    }
}

/**
 * Contains all the topics from Database, one instance 
 * refresh content with the getTopics method (spoiler: inheritance)
 */
class TopicsTable {
    constructor(url) {
        this.categories = require('./categories.json');
        this.baseUrl = url;
        this.topics = my_readFile.getJSONData(url);
        this.currentId = this.topics.length;
    }
    addTopicToBase(data) {
        data.id = this.currentId;
        data.timeStamp = Date();
        this.topics = my_writeFile.writeFile(this.baseUrl, data);
        this.currentId++;
    }
    fetchById(topicId) {
        return this.topics.find(topic => topic.id === topicId);
    }
    getTopicsFromBase(categoryId) {
        return this.topics.filter(topic => topic.categoryId === categoryId);
    }
}


const messageTable = new MessageTable( path.resolve(__dirname, './messages.json'));
const topicTable = new TopicsTable( path.resolve(__dirname, './topics.json'));
module.exports = {
    messageTable,
    topicTable
    };