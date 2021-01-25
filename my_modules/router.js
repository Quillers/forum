/* 
** Include express
*/
const express = require('express');
const path = require('path');

// import database functionality
const MessageDB = require('./database/Database');

const postMW = require('./middlewares/postMW');
const getMW = require('./middlewares/getMW');

/* 
** set the router
*/

const router = express.Router();

/* 
** GET REQUESTS
*/


router.get('/', (request, response) => {
    // Renvoi la page d'accueil avec les catégories en dynamique
    // dans la nav, l'objet categories.json est stocké dans 
    // app.locals.categories
    response.render('index');
});

router.get('/categories/:categoryName', getMW.getCategoryId, getMW.fetchTopicsDB, (request, response) => {
    // console.log(response.locals.topics);
    response.render('category', { topics: response.locals.topics, categoryName: request.params.categoryName });
});

router.get('/topics/:categoryName/:topicName',  getMW.fetchMessagesDB, (request, response) => {

    //and then i render them

    response.render('topic', {  messages: response.locals.messages });
});

/* 
** POST REQUESTS
*/

router.post('/topics/:categoryName/:topicName', postMW.validateResponseForm, postMW.insertMessageDB, (request, response) => {
   //TODO
   //
    response.redirect(`/topics/${request.params.categoryName}/${request.params.topicName}`);
});

module.exports = router;