/*
 ** Include express
 */
const express = require('express');
const path = require('path');

// import database functionality

const postMW = require('./middlewares/postMW');
const getMW = require('./middlewares/getMW');
const connexionMW = require('./connexion/connexionMW');

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
  //Vérification de la session
  response.render('index', {
    info: request.session.info,
    loggedIn: request.session.loggedIn,
  });
});

router.get(
  '/categories/:categoryName',
  getMW.getCategoryId,
  getMW.fetchTopicsDB,
  (request, response) => {
    // See middlewares for more informations
    response.render('category', {
      topics: response.locals.topics,
      categoryName: request.params.categoryName,
      loggedIn: request.session.loggedIn,
      info: request.session.info,
    });
  }
);

router.get('/topics/:categoryName/:topicId',
  getMW.fetchTopicById,
  getMW.fetchMessagesDB,
  (request, response) => {
    // idem
    response.render('topic', {
      topic: response.locals.topic,
      messages: response.locals.messages,
      postUrl: request.url + '/post',
      loggedIn: request.session.loggedIn,
      info: request.session.info,
    });
  });

// CONNEXION - GET
router.get('/connexion', connexionMW.renderConnexionForm);
router.get('/connexion/createAccount', connexionMW.renderCreateAccountForm);


/**
 * POST
 */
router.post('/topics/:categoryName/post', postMW.validateTopicForm, postMW.setCategoryIdInPost, postMW.insertTopicDB, (
  request, response) => {
  //TODO
  //
  response.redirect(`/categories/${request.params.categoryName}`);
});

router.post('/topics/:categoryName/:topicId/post', postMW.validateResponseForm, postMW.insertMessageDB, (request,
  response) => {
  //TODO
  //
  response.redirect(`/topics/${request.params.categoryName}/${request.params.topicId}`);
});

// CONNEXION - POST

router.post('/postConnexion/:pass', connexionMW.selectRoute);

module.exports = router;
