const profileDB = require('../model/profileDB');
const profileViews = require('../view/profileViews');
const mainController = require('../../main/controller/mainController');
const { request } = require('express');

const profileController = {

   
    getProfile: (request, response) => {

        const userID = parseInt(request.params.id);

        // Check if the user is Logged : if he is, call getUserInfo function, if he is not, redirect him to the login page

        if (request.session.data.logguedIn === true && parseInt(request.session.data.id) === userID) {

            profileDB.getUserInfo(userID, (error, userInfo) => {

                // If everything is OK, render the myProfile page
                if (error === null && userInfo.rows.length > 0) {
                    response.userInfo = userInfo.rows[0];
                    response.info = `Bienvenue !`
                    profileViews.view(request, response);
                } 
                // Else, redirect the user to the login page
                else {
                    response.info = `L'utilisateur n'existe pas, veuillez vous identifier.`;
                    response.redirect('/connexion/stdLogin');
                }
            });
        }
        // If user is not logged, redirect to login page
        else {
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
        profileController.updatePseudo(request, response);
        break;
      case 'password':
        profileController.updatePassword(request, response);
        break;
      case 'email':
        profileController.updateEmail(request, response);
        break;
      case 'delete':
        profileController.deleteUserControl(request, response);
        break;

      default:
        response.info = "La route post qu'elle n'existe !!";
        mainController.index(request, response);
        break;
    }
  },

  updatePseudo: (request, response) => {

    const formPseudo = request.body.pseudo;
    const userID = request.session.data.id;
    // Initialize a variable which will contain user informations
    let userInfos;

    // We get the user informations to check if informations have been changed or not.
    profileDB.getUserInfo(userID, (error, userInfo) => {
      userInfos = userInfo;
    })

    if (formPseudo === '' ) {
        response.info = `Le champ Pseudo n'est pas correctement rempli`;
        profileViews.view(request, response);
    }

  }
};

module.exports = profileController;