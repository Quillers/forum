import { Message } from './Message.js'

export class Topic {
  constructor() {
    this.window = document.querySelector('body')
    this.topicContainer = document.getElementById('topicContainer')
  }

  // On créé la div contenant le nom du topic :
  createTopicName() {
    const topicName = document.createElement('div')
    // Pour l'instant u nom bidon
    topicName.textContent = 'Je suis le nom du sujet'
    topicName.id = 'topicName'
    topicName.classList.add('topic__name')
    this.topicContainer.appendChild(topicName)
  }

  // On créé la div contenant l'ensemble des messages :
  createAllMessagesContainer() {
    const topicAllMessagesContainer = document.createElement('div')
    topicAllMessagesContainer.id = 'topicAllMessagesContainer'
    topicAllMessagesContainer.classList.add('topic__allMessages')
    this.topicContainer.appendChild(topicAllMessagesContainer)
  }

  // fonction qui crée une div qui contiend un message :
  createMessage(content = 'je suis un message vide') {
    console.log('récup du formulaire : ' + content)
    // On crée un nouvel objet message avec le contenu de textarea
    const message = new Message(content)
    // On crée la div qui contiendra le message
    const topicMessage = document.createElement('div')
    // On met le contenu
    topicMessage.innerHTML = message.createHtml()
    //
    topicMessage.classList.add('topic__allMessages__message')
    document
      .getElementById('topicAllMessagesContainer')
      .appendChild(topicMessage)
  }

  // Fonction qui créé le formulaire de saisie
  createForm() {
    // On commence par créer son container
    const topicFormContainer = document.createElement('div')
    topicFormContainer.id = 'topicFormContainer'
    topicFormContainer.classList.add('topic__formContainer')

    // On créé le formulaire lui-même :
    const form = document.createElement('form')
    form.classList.add('topic__formContainer__form')

    // On créé un textarea
    const textarea = document.createElement('textarea')
    textarea.placeholder = 'Saisir ici...'
    textarea.classList.add('topic__formContainer__form__textarea')
    textarea.id = 'messageContent'
    form.appendChild(textarea)

    // On créé un bouton de validation du formulaire
    const formButton = document.createElement('button')
    formButton.type = 'button'
    formButton.textContent = 'Valider'
    formButton.classList.add('topic__formContainer__form__button')
    // On lui ajoute un eventListener
    formButton.addEventListener('click', () => {
      // On récup le contenu de textarea
      const content = document.getElementById('messageContent')
      // On crée un message avec
      this.createMessage(content.value)
      // On remet à 0 le contenu de textarea
      content.value = null
    })

    form.appendChild(formButton)

    // On ajoute le formulaire dans son container
    topicFormContainer.appendChild(form)
    // On met le container du formulaire dans le document :
    this.window.appendChild(topicFormContainer)
  }
}
