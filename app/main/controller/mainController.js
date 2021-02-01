const mainViews = require('../views/mainViews');


const mainController = {
  
    // code associé à la route '/'
  index: (request, response) => {
    mainController.setSessionVar(request, response, mainViews.index)
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

  sessionDisconnect: (request, response, next) => {

    request.session = null;

    response.redirect('/');
  },

  
}

module.exports = mainController;