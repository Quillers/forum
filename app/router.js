const express = require('express');
const path = require('path');

// import database functionality

const mainController = require('./main/controller/mainController');
const forumController = require('./forum/controller/forumController');
const connexionController = require('./connexion/controller/connexionController');
const profileController = require('./profile/controller/profileController');

const router = express.Router();

/*------------ GET REQUESTS --------------*/

router.use(mainController.checkSession);

// FORUM
router.get('/', mainController.index);
router.get('/categories', forumController.getCategories);
router.get('/categories/:categoryName', forumController.getAllTopicsByCategoryId);
router.get('/topics/:categoryName/:topicId', forumController.getAllMessagesByTopicId);


// CONNEXION
router.get('/connexion/:pass', connexionController.selectGET);

// PROFILE
router.get('/myProfile', profileController.getProfile);

/*------------ POST REQUESTS --------------*/


// FORUM
router.post('/topics/:categoryName/post', forumController.createNewTopic);
router.post('/topics/:categoryName/:topicId/post', forumController.createNewMessage);
router.post('/topics/:categoryName/:topicId/delete', forumController.deleteMessage);
router.post('/topics/:categoryName/:topicId/edit', forumController.editMessage);

// CONNEXION
router.post('/postConnexion/:pass', connexionController.selectPOST);

// PROFILE
router.post('/postProfile/:pass', profileController.selectPOST);



/*--------------------------------------------*/
module.exports = router;
