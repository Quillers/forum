module.exports = {
  index: (request, response) => {
    response.render('index', {
      info: response.info,
      loggedIn: request.session.loggedIn
    });
  },
}
