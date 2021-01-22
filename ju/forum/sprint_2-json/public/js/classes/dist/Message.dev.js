"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Message = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Représente un message, nom, pseudo et date, il faudrait penser
 * à ajouter le nom du sujet
 */
var Message =
/*#__PURE__*/
function () {
  function Message(topicName, author, content) {
    _classCallCheck(this, Message);

    this.topicName = topicName;
    this.messageContent = content;
    this.author = author;
    this.date = new Date();
  }

  _createClass(Message, [{
    key: "createHtml",
    value: function createHtml() {
      // Création du container du message :
      var messageContainer = document.createElement('div');
      messageContainer.classList.add('message'); // Création header :

      var messageHeader = document.createElement('header');
      messageHeader.classList.add('message__header'); // Création d'un h3 pour le nom de l'auteur :

      var messageAuthor = document.createElement('h3');
      messageAuthor.classList.add('message__author');
      messageAuthor.textContent = this.message.username; // Création du corps du message

      var content = document.createElement('main');
      content.classList.add('message__main');
      content.textContent = this.message.content; // Footer du message :

      var footer = document.createElement('footer');
      footer.classList.add('message__footer'); // La date de création du message

      var date = document.createElement('p');
      date.textContent = "publie le ".concat(this.message.date.toISOString()); // On regroupe :

      messageContainer.appendChild(messageHeader);
      messageContainer.appendChild(content);
      messageContainer.appendChild(footer);
      messageHeader.appendChild(messageAuthor);
      footer.appendChild(date);
      return messageContainer;
    }
  }]);

  return Message;
}();

exports.Message = Message;