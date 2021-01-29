const { render } = require('ejs');
const connexionModel = require('./connexionModel');

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
  selectRoute: (request, response, next) => {
    // Ici récupérer :pass et envoyer la suite en fonction, faire un switch
    const pass = request.params.pass;

    switch (pass) {
      case 'stdLogin':
        connexionModel.stdLoginControl(request, response, next);
        break;
      case 'createAccount':
        connexionModel.createAccountControl(request, response, next);
        break;

      default:
        next();
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
   * Renders the createAccount form view...
   */
  renderCreateAccountForm: (request, response) => {
    response.render('createAccount', {
      loggedIn: request.session.loggedIn,
      info: request.session.info,
    });
  },
};
