"use strict";

var express = require('express');

var topicRouteur = express.Router();
/*---------------ROUTES---------------*/
//

topicRouteur.get('/', function (request, response) {
  // response.sendFile(path.join(__dirname,  './views/index.html'));
  response.render('index', {
    title: 'Le forum Quillers',
    js: false
  });
});
topicRouteur.get('/:type', function (request, response) {
  var type = request.params.type;

  if (type != 'favicon.ico') {
    var jsonFile = require("./../topicsData/".concat(type, ".json")); // On envoi le template


    response.render("topicTemplate", {
      title: 'Topic chargé',
      js: true,
      topicName: request.params.fileName,
      topicData: jsonFile
    });
  }
});
module.exports = topicRouteur;