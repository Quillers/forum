/*
 ** Include express
 */
const express = require('express');
const path = require('path');

// import database functionality

const postMW = require('./middlewares/postMW');
const getMW = require('./middlewares/getMW');
const connexionMW = require('./middlewares/connexionMW');

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
  (request.session.info = 'vide, on test'),
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
    });
  }
);

router.get(
  '/topics/:categoryName/:topicName',
  getMW.fetchMessagesDB,
  (request, response) => {
    // idem
    response.render('topic', { messages: response.locals.messages });
  }
);

// CONNEXION
router.get('/connexion', connexionMW.renderConnexionForm);
router.get('/connexion/createAccount', connexionMW.renderCreateAccountForm);

/*
 ** POST REQUESTS
 */

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

router.post('/postConnexion/:pass', connexionMW.selectRoute);

module.exports = router;
