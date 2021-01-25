/*
** GET MESSAGES MIDDLEWARE 
*/

const {messageTable, topicTable} = require('../database/Database');
const TopicsDB = require('../database/Database');


/*
**  CATEGORIES MIDDLEWARES => HOMEPAGE
*/

/*
**  TOPICS MIDDLEWARES => CATEGORY.ejs
*/

// middleware to get the correct category id from name

const getCategoryId = (request, response, next) => {

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

    response.locals.categoryId = categoryId;
    next();
}

// middleware the fetches all the topics from DB
const fetchTopicsDB = (request, response, next) => {
    //I need the get all topics from base
    response.locals.topics = topicTable.getTopicsFromBase(response.locals.categoryId);
    next();
}
/*
** MESSAGES MIDDLEWARES => TOPIC.ejs
*/

// middleware the fetches all the messages from DB
const fetchMessagesDB = (request, response, next) => {
    //I need the get all messages from base
    response.locals.messages = messageTable.getMessagesFromBase();
    next();
}




module.exports = { 
    fetchMessagesDB,
    getCategoryId,
    fetchTopicsDB,
};