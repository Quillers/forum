const connexionMW = require('./connexionMW');
const renderMW = require('./renderMW');

module.exports = {

  stdConnexion: (request, response) => {

    connexionMW.setSessionVar(request, response, renderMW.stdConnexion)
  },

  createAccount: (request, response) => {

    connexionMW.setSessionVar(request, response, renderMW.createAccount)
  },
}
