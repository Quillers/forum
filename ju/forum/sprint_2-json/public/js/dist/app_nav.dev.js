"use strict";

var _Message = require("./classes/Message.js");

var _MessageItem = require("./classes/MessageItem.js");

var _Topic = require("./classes/Topic.js");

var form = document.getElementById('message-form');
var topic = new _Topic.Topic();

var formSubmitHandler = function formSubmitHandler(event) {
  // On évite l'envoi du formulaire
  event.preventDefault();
  var msg = event.target[0].value;
  var pseudo = event.target[1].value; // On vide le formulaire

  event.target[1].value = '';
  event.target[0].value = '';
  console.log(msg, pseudo); // On gère l'enregistrement du message dans le sujet
  // topic.addMessage(new MessageItem(new Message(msg, pseudo)));
  // On renvoi la liste des messages à afficher
  // const messages = topic.messageListRender();
  // On affiche le contenu json

  topic.getTopicData();
};
/*------------------------------------------------*/


form.addEventListener('submit', formSubmitHandler);