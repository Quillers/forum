const mainViews = require('../views/mainViews');


const mainController = {

  // code associé à la route '/'
  index: (request, response) => { mainViews.index(request, response) },

  /**
   * Set the session' infos
   */
  checkSession: function(request, response, next) {

    if (!request.session.data) {
      request.session.data = {
        logguedIn: false,
        userInfos: null
      }

      response.locals = request.session.data;
    }

    next();
  },

  sessionDisconnect: (request, response, next) => {

    request.session.data = {
      logguedIn: false,
      userInfos: null
    };

    response.redirect('/');
  },


}

module.exports = mainController;
