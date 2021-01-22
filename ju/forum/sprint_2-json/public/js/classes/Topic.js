import { Message } from './Message.js';

/**
 * Représente un sujet, contient une liste d'objet message et / ou un fichier
 * json, fait le lien avec un fichier json qui stock les messages sur le server.
 */
export class Topic {
  constructor(name) {
    this.name = 'creation';
    this.message;
    this.jsonFile = '';
    this.messageContainer = document.getElementById('message-list');
  }

  // Création d'un fichier json 'nom_du_sujet' si premier sujet.
  // C'est un premier sujet si un fichier json du même nom n'existe pas

  // Récupération du fichier json correspondant au sujet
  getTopicData() {
    const request = new XMLHttpRequest();
    // Crée une demande pour notre fichier json
    request.open('GET', `topics/${this.name}`);
    console.log(`./topics/${this.name}`);
    // // Attend une réponse de type json
    // request.responseType = 'json';
    // // A réception on charge this.jsonFile
    // request.onload = () => {
    //   this.jsonFile = request.response;
    //   console.log(this.jsonFile);
    //   this.messageListRender();
    // };
  }

  // Ajout du nouveau message dans le fichier json
  addMessage(Message) {
    this.messageList.push(Message);
  }

  // si besoin Formatage de la liste en json,
  // une boucle qui recrée des MessageItem ?

  /**
   * Fonction qui vide l'affichage, récupère la dernière version
   * du fichier contenant les messages, recrée des MessagesItem
   * qui sont affichés.
   */
  messageListRender() {
    // On vide l'affichage
    this.messageContainer.textContent = '';

    // On affiche le contenu du fichier json
    this.jsonFile['content'].forEach((message) => {
      const oldMessage = new Message(
        message.topicName,
        message.author,
        message.messageContent
      );
      this.messageContainer.appendChild(oldMessage.createHtml());
    });
  }
}
