

module.exports = {
  
  index: (request, response) => {
    
    response.render('index', {
      info: request.session.info,
      loggedIn: request.session.loggedIn
    })
  }
}