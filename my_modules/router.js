const express = require('express');
const path = require('path');

// import database functionality

const forumController = require('./forum/controller/forumController');
const connexionController = require('./middlewares/connexionController');
const connexionMW = require('./connexion/connexionMW');

const router = express.Router();

/*------------ POST REQUESTS --------------*/


// FORUM

router.get('/', forumController.index);
router.get('/categories', forumController.getCategories);
router.get('/categories/:categoryName', forumController.getAllTopicsByCategoryId);
router.get('/topics/:categoryName/:topicId', forumController.getAllMessagesByTopicId);


// CONNEXION
router.get('/connexion', connexionController.stdConnexion);
router.get('/connexion/createAccount', connexionController.createAccount);

/*------------ POST REQUESTS --------------*/

/**
 * POST
 */
router.post('/topics/:categoryName/post', forumController.createNewTopic);

router.post('/topics/:categoryName/:topicId/post', forumController.createNewMessage);

// router.post('/topics/:categoryName/:topicId/post', postMW.validateResponseForm, postMW.insertMessageDB, (request,
//   response) => {
//   //TODO
//   //
//   response.redirect(`/topics/${request.params.categoryName}/${request.params.topicId}`);
// });

// CONNEXION
router.post('/postConnexion/:pass',
  connexionMW.selectRoute,
);


/*--------------------------------------------*/
module.exports = router;
