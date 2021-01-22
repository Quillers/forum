const path = require('path');
/*---------------------------------------------*/
module.exports = {
  throw404: (request, response, next) => {
    //SINON on affiche la vue 404
    response.render('404');
    next();
  },
};
