/*
** GET MESSAGES MIDDLEWARE 
*/

const MessageDB = require('../database/Database');


// middleware the fetches all the messages from DB
const fetchMessagesDB = (request, response, next) => {
    //I need the get all messages from base
    response.locals.messages = MessageDB.getMessagesFromBase();
    next();
}

module.exports = {fetchMessagesDB};