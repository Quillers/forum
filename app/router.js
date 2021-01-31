const express = require('express');
const path = require('path');

// import database functionality

const postMW = require('./forum/postMW');
const getMW = require('./forum/getMW');
const forumController = require('./forum/forumController');
const connexionController = require('./connexion/controller/connexionController');

const router = express.Router();

/*------------ POST REQUESTS --------------*/


// Renvoi la page d'accueil avec les catégories en dynamique
// dans la nav.
router.get('/', forumController.index);

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

// CONNEXION
router.get('/connexion', connexionController.stdConnexion);

router.get('/connexion/createAccount', connexionController.createAccount);
router.get('/connexion/disconnect', connexionController.sessionDisconnect, forumController.index)

/*------------ POST REQUESTS --------------*/

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

// CONNEXION
router.post('/postConnexion/:pass',
  connexionController.selectRoute,
);

/*--------------------------------------------*/
module.exports = router;
