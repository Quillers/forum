const { render } = require('ejs');
const connexionModel = require('./../connexion/connexionModel');
const forumController = require('./../middlewares/forumController');

module.exports = {
  /**
   * Using ':pass', select what to do next :
   * ':pass' can take following values :
   *    - stdLogin,
   *    - createAccount,
   *    - lostPass,
   * @param {Object} request
   * @param {Object} response
   */
  selectRoute: (request, response) => {
    // Ici récupérer :pass et envoyer la suite en fonction, faire un switch
    const pass = request.params.pass;

    switch (pass) {
      case 'stdLogin':
        connexionModel.stdLoginControl;
        break;
      case 'createAccount':
        connexionModel.createAccountControl;
        break;

      default:
        request.session.info = "La route post qu'elle n'existe !!";
        forumController.index
        break;
    }
  },

  /**
   * Render connexion view
   * @param {Object} request
   * @param {Object} response
   */
  renderConnexionForm: (request, response) => {
    response.render('connexion', {
      loggedIn: request.session.loggedIn,
      info: request.session.info,
    });
  },

  /**
   * Set the session' infos
   */
  setSessionVar: (request, response, callback) => {
    let info, loggedIn;

    if (request.session.info) {
      info = request.session.info;
    } else {
      info = "info => vide";
    }

    if (request.session.loggedIn) {
      loggedIn = request.session.loggedIn;
    } else {
      loggedIn = "loggedIn => visiteur, pas connecté";
    }

    if (request.session.status) {
      status = request.session.status;
    } else {
      status = "status => visiteur, pas connecté";
    }

    callback(request, response, info, loggedIn, status);
  }
};
