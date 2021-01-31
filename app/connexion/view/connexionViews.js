module.exports = {

  stdConnexion: (request, response) => {
    response.render('stdLogin', {
      info: response.info,
      loggedIn: request.session.loggedIn
    });
  },

  /**
   * Renders the createAccount form view...
   */
  createAccount: (request, response) => {
    response.render('createAccount', {
      info: response.info,
      loggedIn: request.session.loggedIn
    });
  },


  lostPass: (request, response) => {
    response.render('lostPass', {
      info: response.info,
      loggedIn: request.session.loggedIn
    });
  },

  page404: (request, response) => {
    response.info = "C'est pas la bonne route";

    response.status(404)
      .render('404', {
        info: response.info,
        loggedIn: request.session.loggedIn
      });
  }
}
