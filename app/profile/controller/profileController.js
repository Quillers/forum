const profileDB = require('../model/profileDB');
const profileViews = require('../view/profileViews');
const mainController = require('../../main/controller/mainController');
const formController = require('./formController');


const profileController = {

   
    getProfile: (request, response) => {

      // Test si la variable userInfos existe ou pas.
      if (typeof request.session.data.userInfos !== 'undefined') {
        response.info = `Bienvenue ${request.session.data.userInfos.pseudo}!`;
        profileViews.view(request, response);

      } else {
            response.info = 'Veuillez vous identifier pour accéder à cette page.';
            response.redirect('/connexion/stdLogin');
        }
        
      },

    /*-------------- ROUTE SELECTOR ------------*/
  /**
   * Using ':pass', select what to do next :
   * ':pass' can take following values :
   *    - stdLogin,
   *    - createAccount,
   *    -lostPass,
   *    -deleteUser,
   */
  selectPOST: (request, response) => {
    // Ici récupérer :pass et envoyer la suite en fonction, faire un switch
    const pass = request.params.pass;
    console.log('etape 0', pass);

    switch (pass) {
      case 'pseudo':
        formController.controlFormPseudo(request, response);
        break;
      // case 'password':
      //   profileController.updatePassword(request, response);
      //   break;
      // case 'email':
      //   profileController.updateEmail(request, response);
      //   break;
      // case 'delete':
      //   profileController.deleteUserControl(request, response);
      //   break;

      default:
        response.info = "La route post qu'elle n'existe !!";
        mainController.index(request, response);
        break;
    }
  },
};

module.exports = profileController;