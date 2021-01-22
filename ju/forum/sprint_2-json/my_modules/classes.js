/**
 * Représente un message fabriqué à partir du formulaire
 * */
class MessageFromPost {
  constructor(topicName, messageContent, author, date) {
    this.topicName = topicName;
    this.messageContent = messageContent;
    this.author = author;
    this.date = date;
  }

  /**
   * Retourne un objet au format qui va bien dans le json
   */
  createJSON() {
    return {
      topicName: this.topicName,
      messageContent: this.messageContent,
      author: this.author,
      date: this.date,
    };
  }
}

module.exports = { MessageFromPost };
