const mainViews = require('../views/mainViews');


const mainController = {

  // code associé à la route '/'
  index: (request, response) => { mainViews.index(request, response) },

  /**
   * Set the session' infos
   */
  checkSession: function(request, response, next) {

    if (!request.session.data) {
      const data = {
        logguedIn: false,
        userInfos: null
      }

      request.session.data = data;
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
