/*
** POSTMESSAGE MIDDLEWARE
*/

const MessageDB = require('../database/Database');


//this middleware takes care of validating the datas received from the form

const validateResponseForm = (request, response, next) => {
    // I intercept the data from the form in request.body and store it in an object
    const messageData = { messageContent: request.body.message, author: request.body.username }

    //TODO need to validate the data!!!! => saw a video about request header and validate from front JS

    //...here i just make sure author and content are not empty
    if (!messageData.author || !messageData.messageContent) {
        response.send(`
            <h1>Recommencez votre message, vous avez oublie quelque chose</h1>
            <a href="/">Retourner a la liste des sujets</a>
            `);
    } else {
        response.locals.validatedData = messageData;
        next();
    }
};

// this middleware is called after the data has been validated, to be added to the database

const insertMessageDB = (request, response, next) => {
    //Here I populate the database
    MessageDB.addMessageToBase(response.locals.validatedData);
    next();
}

module.exports = {
    validateResponseForm,
    insertMessageDB
};