/* 
** Include express
*/
const express = require('express');
const path = require('path');

// import database functionality
const MessageDB = require('./database/Database');

const postMW = require('./middlewares/postMessageMW');
const getMW = require('./middlewares/getMessagesMW');

/* 
** set the router
*/

const router = express.Router();

/* 
** GET REQUESTS
*/

router.get('/', getMW.fetchMessagesDB, (request, response) => {
    if (typeof request.body === undefined) {
        console.log("body n'existe pas");
    } else {
        console.log(request.body);
    }
   
    //and then i render them

    response.render('index', {  messages: response.locals.messages });
});

/* 
** POST REQUESTS
*/


router.post('/', postMW.validateResponseForm, postMW.insertMessageDB, (request, response) => {
    //send the response everyting went well + link back to thread
    // response.send(`
    // <h1>Message Bien enregistre</h1>
    //     <a href="/">Retourner a la liste des sujets</a>
    //     `);
    // response.render('index', { messages:  MessageDB.getMessagesFromBase()});
    if (typeof request.body === undefined) {
        console.log("body n'existe pas");
    } else {
        console.log(request.body);
    }
    response.redirect('/');
});

module.exports = router;