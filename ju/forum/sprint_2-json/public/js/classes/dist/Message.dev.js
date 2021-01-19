"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Message = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Représente un message, nom, pseudo et date, il faudrait penser
 * à ajouter le nom du sujet
 */
var Message = function Message(content, author) {
  _classCallCheck(this, Message);

  this.messageContent = content;
  this.author = author;
  this.date = new Date();
};

exports.Message = Message;