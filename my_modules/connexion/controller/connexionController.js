const connexionViews = require('./../view/connexionViews');
const connexionDB = require('./../model/connexionDB');
const forumController = require('./../../forum/forumController');

const connexionController = {

  stdConnexion: function(request, response) {

    connexionController.setSessionVar(request, response, connexionViews.stdConnexion)
  },

  createAccount: (request, response) => {

    connexionController.setSessionVar(request, response, connexionViews.createAccount)
  },

  /**
   * Using ':pass', select what to do next :
   * ':pass' can take following values :
   *    - stdLogin,
   *    - createAccount,
   *    - lostPass,
   */
  selectRoute: (request, response) => {
    // Ici récupérer :pass et envoyer la suite en fonction, faire un switch
    const pass = request.params.pass;

    switch (pass) {
      case 'stdLogin':
        connexionDB.stdLoginControl;
        break;
      case 'createAccount':
        connexionDB.createAccountControl;
        break;
      case 'lostPass':
        connexionDB.lostPasswordControl;
        break;

      default:
        request.session.info = "La route post qu'elle n'existe !!";
        forumController.index
        break;
    }
  },

  /**
   * Set the session' infos
   */
  setSessionVar: function(request, response, callback) {

    if (!request.session.loggedIn) {
      request.session.loggedIn = "loggedIn => visiteur, pas connecté";
    }

    callback(request, response);
  },
}

module.exports = connexionController;
