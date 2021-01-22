"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Représente un message fabriqué à partir du formulaire
 * */
var MessageFromPost =
/*#__PURE__*/
function () {
  function MessageFromPost(topicName, messageContent, author, date) {
    _classCallCheck(this, MessageFromPost);

    this.topicName = topicName;
    this.messageContent = messageContent;
    this.author = author;
    this.date = date;
  }
  /**
   * Retourne un objet au format qui va bien dans le json
   */


  _createClass(MessageFromPost, [{
    key: "createJSON",
    value: function createJSON() {
      return {
        topicName: this.topicName,
        messageContent: this.messageContent,
        author: this.author,
        date: this.date
      };
    }
  }]);

  return MessageFromPost;
}();

module.exports = {
  MessageFromPost: MessageFromPost
};