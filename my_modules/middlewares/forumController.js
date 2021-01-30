const connexionMW = require('./connexionMW');
const renderMW = require('./renderMW');

module.exports = {

  // code associé à la route '/'
  index: (request, response) => {

    connexionMW.setSessionVar(request, response, renderMW.index)
  }
};
