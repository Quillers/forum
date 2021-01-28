/* 
** Include express
*/
const express = require('express');
const path = require('path');

// import database functionality

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
    // app.locals.categories depuis index.js
    response.render('index');
});

router.get('/categories/:categoryName', getMW.getCategoryId, getMW.fetchTopicsDB, (request, response) => {
    // See middlewares for more informations
    response.render('category', { topics: response.locals.topics, categoryName: request.params.categoryName });
});

router.get('/topics/:categoryName/:topicName',  getMW.fetchMessagesDB, (request, response) => {
    // idem
    response.render('topic', {  messages: response.locals.messages });
});

/* 
** POST REQUESTS
*/

router.post('/topics/:categoryName/post', postMW.validateTopicForm, postMW.setCategoryIdInPost, postMW.insertTopicDB, (request, response) => {
    //TODO
    //
     response.redirect(`/categories/${request.params.categoryName}`);
 });

router.post('/topics/:categoryName/:topicName', postMW.validateResponseForm, postMW.insertMessageDB, (request, response) => {
   //TODO
   //
    response.redirect(`/topics/${request.params.categoryName}/${request.params.topicName}`);
});

module.exports = router;