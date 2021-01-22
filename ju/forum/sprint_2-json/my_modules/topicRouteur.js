const express = require('express');
const path = require('path');
const fs = require('fs');
const dayjs = require('dayjs');
const { response } = require('express');

/*--------------MY MODULES -----------------*/
const classes = require('./classes');
const mw = require('./mw');

/*---------------------------------------*/
const topicRouteur = express.Router();

/*---------------ROUTES---------------*/
topicRouteur.get('/favicon.ico', (request, response, next) => {
  response.send('');
});
//
topicRouteur.get('/', (request, response) => {
  // response.sendFile(path.join(__dirname,  './views/index.html'));
  response.render('index', {
    title: 'Le forum Quillers',
    cssFile: `./css/style.css`,
    js: false,
  });
});

// SA MERE NODEMON !!!
topicRouteur.post('/post/:topicName', (request, response, next) => {
  // Récupération des infos nécessaires
  const messageContent = request.body.message;
  const author = request.body.username;
  const date = dayjs();
  // On reset les params de POST
  request.body.message = null;
  request.body.username = null;
  //
  let jsonFile;
  // On try catch le jsonFile
  try {
    // On récup le fichier json correspondant au sujet
    jsonFile = require(`${__dirname}/../topicsData/${request.params.topicName}.json`);
    // On l'attache à locals
  } catch (error) {
    console.log(error);
    next();
  }
  // Création d'un objet à pousser dans le jsonFile, retourne un objet js
  const newMessage = new classes.MessageFromPost(
    request.params.topicName,
    messageContent,
    author,
    date
  );
  // On append le nouveau message,
  jsonFile.content.push(newMessage.createJSON());
  // On write (writeFileSync ça fonctionnait aussi...)
  fs.writeFile(
    `./topicsData/${request.params.topicName}.json`,
    JSON.stringify(jsonFile),
    function (err) {
      if (err) return console.log(err);
    }
  );
  // Le formulaire doit être vidé en rechargeant la page, une
  // solution est de rediriger vers une url différente
  response.redirect(`/topics/${request.params.topicName}?action=get`);
});

topicRouteur.get('/topics/:topicName', (request, response, next) => {
  // On récupère les infos GET :

  console.log('on get');
  let jsonFile;

  // On try catch le jsonFile
  try {
    // On récup le fichier json correspondant au sujet
    jsonFile = require(`${__dirname}/../topicsData/${request.params.topicName}.json`);

    // Si on veut afficher un sujet
    if (request.query.action === 'get' && jsonFile) {
      response.render(`topicTemplate`, {
        title: request.params.topicName,
        js: true,
        topicName: request.params.fileName,
        topicData: jsonFile,
        cssFile: './../../css/style.css',
      });
    }
  } catch (error) {
    console.log(error);
    next();
  }
});
//
module.exports = topicRouteur;
