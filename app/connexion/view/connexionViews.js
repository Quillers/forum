module.exports = {

  /**
   * Sets the views with :
   * 
   * request.session.data = { 
   *   - logguedIn:  boolean,
   *   - userStatus: string,
   *   - userId : number,
   * }
   * 
   * response.info = string
   * 
   * @param {Object} request 
   * @param {Object} response 
   */
  view: (request, response, ) => {
    response.render(request.params.view, {
      session: request.session,
      info: response.info
    })
  },

  page404: (request, response) => {
    if (!response.info) {
      response.info = "C'est pas la bonne route";
    }

    response.status(404)
      .render('404', { session: request.session, info: response.info })
  },
}
