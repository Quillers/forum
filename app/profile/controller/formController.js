const profileDB = require('../model/profileDB');
const profileViews = require('../view/profileViews');
const bcrypt = require('bcrypt');

const formController = {

  controlFormPseudo: (request, response) => {

    const formPseudo = request.body.pseudo;
    const userInfos = request.session.data.userInfos;

    // Control if the form pseudo is ok

    if (formPseudo === '') {

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
          profileDB.updateUserPseudo(userInfos.id, formPseudo, (_) => {

            // It is not necessary to logout and login to update the session pseudo, we replace it directly
            userInfos.pseudo = formPseudo;
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

  controlFormPassword: (request, response) => {

    const formPassword_1 = request.body.password1;
    const formPassword_2 = request.body.password2;
    const userInfos = request.session.data.userInfos;

    // The only situation that will works fine is if formPassword_1 and formPassword_2 are strictly equals and different from nothing. Any other situation will result on an error message with a redirection.
    if (formPassword_1 === formPassword_2 && formPassword_1 !== '') {

      // Let's encrypt the password before insert it into the Database.
      bcrypt.hash(formPassword_1, 10, (err, hash) => {

        if (err) {
          console.log(err)

        } else {
          // Update the user password with encrypted password
          profileDB.updateUserPassword(userInfos.id, hash, (_) => {

            response.info = `Le mot de passe a été mis à jour.`;
            // Render the profile view.
            profileViews.view(request, response);

          });
        }
      });

    } else {
      response.info = `Il y a une erreur dans la saisie des mots de passe.`;
      profileViews.view(request, response);
    }
  },

  controlFormEmail: (request, response) => {

    const formEmail_1 = request.body.email1;
    const formEmail_2 = request.body.email2;
    const userInfos = request.session.data.userInfos;

    // The only situation that will works fine is if email_1 and email_2 are strictly equals and different from nothing. Any other situation will result on an error message with a redirection.
    if (formEmail_1 === formEmail_2 && formEmail_1 !== '') {

      profileDB.updateUserEmail(userInfos.id, formEmail_1, (_) => {
        // It is not necessary to logout and login to update the session e-mail, we replace it directly
        userInfos.email = formEmail_1;
        response.info = `L'email a bien été mis à jour.`;
        // Render the profile view.
        profileViews.view(request, response);
      });
    } else {
      response.info = `Il y a une erreur dans la saisie des e-mails.`;
      profileViews.view(request, response);
    }
  },

}
// Commentaire juste pour tester le webhook Discord.
module.exports = formController;
