const connexionController = require('./../connexion/controller/connexionController');
const forumView = require('./view/forumViews');

module.exports = {

  // code associé à la route '/'
  index: (request, response) => {

    connexionController.setSessionVar(request, response, forumView.index)
  }
};
