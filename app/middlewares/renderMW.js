module.exports = {

  index: (request, response, info, loggedIn) => {
    response.render('index', {
      info: info,
      loggedIn: loggedIn
    });
  },

  stdConnexion: (request, response, info, loggedIn) => {
    response.render('connexion', {
      info: info,
      loggedIn: loggedIn
    });
  },

  createAccount: (request, response, info, loggedIn) => {
    response.render('createAccount', {
      info: info,
      loggedIn: loggedIn
    });
  },

  page404: (request, response) => {
    request.session.info = "C'est pas la bonne route";
    request.session.loggedIn = "Tu es déconnecté... enfin c'est l'idée quoi";

    response.status(404)
      .render('404', {
        info: request.session.info,
        loggedIn: request.session.loggedIn,
      })
  }
}
