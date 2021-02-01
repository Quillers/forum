const express = require('express');
const path = require('path');

// import database functionality

const mainController = require('./main/controller/mainController');
const forumController = require('./forum/controller/forumController');
const connexionController = require('./connexion/controller/connexionController');

const router = express.Router();

/*------------ POST REQUESTS --------------*/


// Renvoi la page d'accueil avec les catégories en dynamique
// dans la nav.
router.get('/', mainController.index);
router.get('/categories', forumController.getCategories);
router.get('/categories/:categoryName', forumController.getAllTopicsByCategoryId);
router.get('/topics/:categoryName/:topicId', forumController.getAllMessagesByTopicId);


// CONNEXION
router.get('/connexion', connexionController.stdConnexion);

router.get('/connexion/createAccount', connexionController.createAccount);
router.get('/connexion/disconnect', mainController.sessionDisconnect)

/*------------ POST REQUESTS --------------*/

/**
 * POST
 */

 // FORUM
 router.post('/topics/:categoryName/post', forumController.createNewTopic);
 router.post('/topics/:categoryName/:topicId/post', forumController.createNewMessage);

// CONNEXION
router.post('/postConnexion/:pass',
  connexionController.selectRoute,
);

/*--------------------------------------------*/
module.exports = router;
