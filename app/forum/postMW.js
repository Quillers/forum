/*
** POST MIDDLEWARE
*/

const {messageTable, topicTable} = require('../database/Database');

/*
** POST TOPIC MIDDLEWARE
*/



const validateTopicForm = (request, response, next) => {
    // I intercept the data from the form in request.body and store it in an object
    const topicData = { topicDesc: request.body.topic__desc, author: request.body.topic__username, title: request.body.topic__title }
    //TODO need to validate the data!!!! => saw a video about request header and validate from front JS

    //...here i just make sure author, description and content are not empty
    if (!topicData.author || !topicData.topicDesc || !topicData.title) {
        response.send(`
            <h1>Recommencez votre topic, vous avez oublie quelque chose</h1>
            <a href="/categories/${ request.params.categoryName }">Retourner a la liste des sujets</a>
            `);
    } else {
        response.locals.validatedData = topicData;
        next();
    }
};

const setCategoryIdInPost = (request, response, next) => {

    let categoryId = null;
    for ( category of request.app.locals.categories ) {
        if (category.name === request.params.categoryName)
            categoryId = category.id;
    }
    
    //todo validate
    if (categoryId === null) {
        response.status(404).send('categorie n existe pas ' + categoryId);
        return ;
    }

    response.locals.validatedData.categoryId = categoryId;
    next();
}

const insertTopicDB = (request, response, next) => {
    //Here I populate the database
    topicTable.addTopicToBase(response.locals.validatedData);
    next();
}

/*
** POSTMESSAGE MIDDLEWARE
*/

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
        //we add the Id of the topic to messageData object
        messageData.topicId = +request.params.topicId;
        //we store the message data in the reponse local to pass it to next middleware
        response.locals.validatedData = messageData;
        next();
    }
};

// this middleware is called after the data has been validated, to be added to the database

const insertMessageDB = (request, response, next) => {

    //Here I populate the database
    messageTable.addMessageToBase(response.locals.validatedData);
    next();
}

module.exports = {
    validateResponseForm,
    insertMessageDB,
    validateTopicForm,
    setCategoryIdInPost,
    insertTopicDB
};