const profileDB = require('../model/profileDB');
const profileViews = require('../view/profileViews');
const mainController = require('../../main/controller/mainController');
const { request } = require('express');

const formController = {

    controlFormPseudo: (request, response) => {

        const formPseudo = request.body.pseudo;
        const userInfos = request.session.data.userInfos;
    
        // Control if the form pseudo is ok
    
        if (formPseudo === '' ) {
    
            response.info = `Le champ Pseudo n'est pas correctement rempli`;
            profileViews.view(request, response);
    
        } else if (formPseudo === userInfos.pseudo) {
    
          response.info = `Le pseudo n'a pas changé !`;
          profileViews.view(request, response);
    
        } else {
          // Everything seems to be fine so we try to update the pseudo. 
          // Before starting, let's check if the pseudo is already used.
          profileDB.getUserByPseudo(formPseudo, (user) => {
            
              if (!user.rowCount) { // If pseudo doesn't exist

                // Ici function avec callback pour l'insertion du profil
                profileDB.updateUserPseudo(userInfos.id, formPseudo, (result) => {
                    console.log(result);
                    response.info = `Le pseudo a été mis à jour`;
                    // Le render car tout est bon
                    profileViews.view(request, response);
                  });
                  
                } else {
                  // le pseudo est déjà pris:
                  response.info = `Le pseudo est déjà pris`;
                  profileViews.view(request, response);
                  }
          });
        }
    },

}

module.exports = formController;