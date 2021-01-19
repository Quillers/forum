const express = require('express');
const topicRouteur = express.Router();

/*---------------ROUTES---------------*/
//
topicRouteur.get('/', (request, response) => {
  // response.sendFile(path.join(__dirname,  './views/index.html'));
  response.render('index', {
    title: 'Le forum Quillers',
    js: false,
  });
});

topicRouteur.get('/:type', (request, response) => {
  const type = request.params.type;

  if (type != 'favicon.ico') {
    const jsonFile = require(`./../topicsData/${type}.json`);

    // On envoi le template
    response.render(`topicTemplate`, {
      title: 'Topic chargé',
      js: true,
      topicName: request.params.fileName,
      topicData: jsonFile,
    });
  }
});

module.exports = topicRouteur;
