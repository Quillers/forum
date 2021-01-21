/* 
** Include express
*/
const express = require('express');
const path = require('path');

// import database functionality
const MessageDB = require('./database/Database');

/* 
** set the router
*/

const router = express.Router();

/* 
** Handling the different Routes
*/

/*    GET REQUESTS
*/
router.get('/', (request, response) => {
    //I need the get all messages from base
    const messages = MessageDB.getMessagesFromBase();
    response.render('index', {messages: messages });
});

/*    POST REQUESTS
*/

router.post('/', (request, response) => {
    // I intercept the data from the form in request.body and store it in an object
   const MessageData = { messageContent: request.body.message, author: request.body.username }
   //TODO need to validate the data!!!! => saw a video about request header and validate from front JS
    //...here i just make sure author and content are not empty

    if (!MessageData.author || !MessageData.messageContent) {
    response.send(`
        <h1>Recommencez votre message, vous avez oublie quelque chose</h1>
        <a href="/">Retourner a la liste des sujets</a>
        `);
        return;
    }
   //Here I populate the database
   MessageDB.addMessageToBase(MessageData);
   //send the response everyting went well + link back to thread
    response.send(`
    <h1>Message Bien enregistre</h1>
        <a href="/">Retourner a la liste des sujets</a>
        `);

});

// router.post('/postMessage', (request, response) => {
//     console.log("postMessage post");
//     console.log(request.body);
//     response.send('Post to postMessages');
// });

//export the router
module.exports = router;