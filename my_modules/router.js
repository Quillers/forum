const express = require('express');
const path = require('path');

// import database functionality

const postMW = require('./middlewares/postMW');
const getMW = require('./middlewares/getMW');
const forumController = require('./middlewares/forumController');
const connexionController = require('./middlewares/connexionController');
const connexionMW = require('./middlewares/connexionMW');

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

router.get(
  '/topics/:categoryName/:topicName',
  getMW.fetchMessagesDB,
  (request, response) => {
    // idem
    response.render('topic', {
      messages: response.locals.messages,
      loggedIn: request.session.loggedIn,
      info: request.session.info,
    });
  }
);

// CONNEXION
router.get('/connexion', connexionController.stdConnexion);
router.get('/connexion/createAccount', connexionController.createAccount);

/*------------ POST REQUESTS --------------*/

router.post(
  '/topics/:categoryName/:topicName',

  postMW.validateResponseForm,

  postMW.insertMessageDB,
  (request, response) => {
    //TODO
    //
    response.redirect(
      `/topics/${request.params.categoryName}/${request.params.topicName}`
    );
  }
);

// CONNEXION
router.post('/postConnexion/:pass',
  connexionMW.selectRoute,
);

/*--------------------------------------------*/
module.exports = router;
