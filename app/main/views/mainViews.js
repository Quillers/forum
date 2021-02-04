module.exports = {

  index: (request, response) => {

    response.render('index', {
      session: request.session,
      info: response.info
    })
  },

}
