/**
 * Représente un message, nom, pseudo et date, il faudrait penser
 * à ajouter le nom du sujet
 */
export class Message {
  constructor(topicName, author, content) {
    this.topicName = topicName;
    this.messageContent = content;
    this.author = author;
    this.date = new Date();
  }

  createHtml() {
    // Création du container du message :
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message');

    // Création header :
    const messageHeader = document.createElement('header');
    messageHeader.classList.add('message__header');

    // Création d'un h3 pour le nom de l'auteur :
    const messageAuthor = document.createElement('h3');
    messageAuthor.classList.add('message__author');
    messageAuthor.textContent = this.message.username;

    // Création du corps du message
    const content = document.createElement('main');
    content.classList.add('message__main');
    content.textContent = this.message.content;

    // Footer du message :
    const footer = document.createElement('footer');
    footer.classList.add('message__footer');

    // La date de création du message
    const date = document.createElement('p');
    date.textContent = `publie le ${this.message.date.toISOString()}`;

    // On regroupe :
    messageContainer.appendChild(messageHeader);
    messageContainer.appendChild(content);
    messageContainer.appendChild(footer);
    messageHeader.appendChild(messageAuthor);
    footer.appendChild(date);

    return messageContainer;
  }
}
