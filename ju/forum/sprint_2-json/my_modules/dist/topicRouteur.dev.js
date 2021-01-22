"use strict";

var express = require('express');

var path = require('path');

var fs = require('fs');

var dayjs = require('dayjs');

var _require = require('express'),
    response = _require.response;
/*--------------MY MODULES -----------------*/


var classes = require('./classes');

var mw = require('./mw');
/*---------------------------------------*/


var topicRouteur = express.Router();
/*---------------ROUTES---------------*/

topicRouteur.get('/favicon.ico', function (request, response, next) {
  response.send('');
}); //

topicRouteur.get('/', function (request, response) {
  // response.sendFile(path.join(__dirname,  './views/index.html'));
  response.render('index', {
    title: 'Le forum Quillers',
    cssFile: "./css/style.css",
    js: false
  });
}); // SA MERE NODEMON !!!

topicRouteur.post('/post/:topicName', function (request, response, next) {
  // Récupération des infos nécessaires
  var messageContent = request.body.message;
  var author = request.body.username;
  var date = dayjs(); // On reset les params de POST

  request.body.message = null;
  request.body.username = null; //

  var jsonFile; // On try catch le jsonFile

  try {
    // On récup le fichier json correspondant au sujet
    jsonFile = require("".concat(__dirname, "/../topicsData/").concat(request.params.topicName, ".json")); // On l'attache à locals
  } catch (error) {
    console.log(error);
    next();
  } // Création d'un objet à pousser dans le jsonFile, retourne un objet js


  var newMessage = new classes.MessageFromPost(request.params.topicName, messageContent, author, date); // On append le nouveau message,

  jsonFile.content.push(newMessage.createJSON()); // On write (writeFileSync ça fonctionnait aussi...)

  fs.writeFile("./topicsData/".concat(request.params.topicName, ".json"), JSON.stringify(jsonFile), function (err) {
    if (err) return console.log(err);
  }); // Le formulaire doit être vidé en rechargeant la page, une
  // solution est de rediriger vers une url différente

  response.redirect("/topics/".concat(request.params.topicName, "?action=get"));
});
topicRouteur.get('/topics/:topicName', function (request, response, next) {
  // On récupère les infos GET :
  console.log('on get');
  var jsonFile; // On try catch le jsonFile

  try {
    // On récup le fichier json correspondant au sujet
    jsonFile = require("".concat(__dirname, "/../topicsData/").concat(request.params.topicName, ".json")); // Si on veut afficher un sujet

    if (request.query.action === 'get' && jsonFile) {
      response.render("topicTemplate", {
        title: request.params.topicName,
        js: true,
        topicName: request.params.fileName,
        topicData: jsonFile,
        cssFile: './../../css/style.css'
      });
    }
  } catch (error) {
    console.log(error);
    next();
  }
}); //

module.exports = topicRouteur;