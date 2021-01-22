"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Topic = void 0;

var _Message = require("./Message.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Représente un sujet, contient une liste d'objet message et / ou un fichier
 * json, fait le lien avec un fichier json qui stock les messages sur le server.
 */
var Topic =
/*#__PURE__*/
function () {
  function Topic(name) {
    _classCallCheck(this, Topic);

    this.name = 'creation';
    this.message;
    this.jsonFile = '';
    this.messageContainer = document.getElementById('message-list');
  } // Création d'un fichier json 'nom_du_sujet' si premier sujet.
  // C'est un premier sujet si un fichier json du même nom n'existe pas
  // Récupération du fichier json correspondant au sujet


  _createClass(Topic, [{
    key: "getTopicData",
    value: function getTopicData() {
      var request = new XMLHttpRequest(); // Crée une demande pour notre fichier json

      request.open('GET', "topics/".concat(this.name));
      console.log("./topics/".concat(this.name)); // // Attend une réponse de type json
      // request.responseType = 'json';
      // // A réception on charge this.jsonFile
      // request.onload = () => {
      //   this.jsonFile = request.response;
      //   console.log(this.jsonFile);
      //   this.messageListRender();
      // };
    } // Ajout du nouveau message dans le fichier json

  }, {
    key: "addMessage",
    value: function addMessage(Message) {
      this.messageList.push(Message);
    } // si besoin Formatage de la liste en json,
    // une boucle qui recrée des MessageItem ?

    /**
     * Fonction qui vide l'affichage, récupère la dernière version
     * du fichier contenant les messages, recrée des MessagesItem
     * qui sont affichés.
     */

  }, {
    key: "messageListRender",
    value: function messageListRender() {
      var _this = this;

      // On vide l'affichage
      this.messageContainer.textContent = ''; // On affiche le contenu du fichier json

      this.jsonFile['content'].forEach(function (message) {
        var oldMessage = new _Message.Message(message.topicName, message.author, message.messageContent);

        _this.messageContainer.appendChild(oldMessage.createHtml());
      });
    }
  }]);

  return Topic;
}();

exports.Topic = Topic;