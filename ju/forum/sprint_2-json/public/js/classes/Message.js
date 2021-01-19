/**
 * Représente un message, nom, pseudo et date, il faudrait penser
 * à ajouter le nom du sujet
 */
export class Message {
  constructor(content, author) {
    this.messageContent = content;
    this.author = author;
    this.date = new Date();
  }
}
