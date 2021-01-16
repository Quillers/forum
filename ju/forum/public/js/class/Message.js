export class Message {
  //
  constructor(content) {
    //
    this.content = content
  }

  // Fonction qui return le texte mis en forme
  createHtml() {
    return `<p>${this.content}</p>`
  }
}
