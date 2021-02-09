const connexionViews = require('./../view/connexionViews');
const connexionDB = require('./../model/connexionDB');
const mainController = require('../../main/controller/mainController');
const bcrypt = require('bcrypt');


const connexionController = {

  /*-------------- VIEWS ----------------*/

  stdConnexion: (request, response) => { connexionViews.view(request, response)},
  createAccount: (request, response) => { connexionViews.view(request, response); },
  lostPass: (request, response) => { connexionViews.view(request, response); },
  deleteUser: (request, response) => { connexionViews.view(request, response); },

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

    switch (pass) {
      case 'stdLogin':
        connexionController.stdLoginControl(request, response);
        break;
      case 'createAccount':
        connexionController.createAccountControl(request, response);
        break;
      case 'lostPass':
        connexionController.lostPasswordControl(request, response);
        break;
      case 'deleteUser':
        connexionController.deleteUserControl(request, response);
        break;

      default:
        response.info = "La route post qu'elle n'existe !!";
        mainController.index(request, response);
        break;
    }
  },

  /**
   * Using ':pass', select what to do next :
   * ':pass' can take following values :
   *    - stdLogin,
   *    - createAccount,
   *    -lostPass,
   *    -deleteUser,
   */
  selectGET: (request, response) => {
    // Ici récupérer :pass et envoyer la suite en fonction, faire un switch
    const pass = request.params.pass;
    console.log('etape 0', pass);

    switch (pass) {
      case 'stdLogin':
        connexionController.stdConnexion(request, response);
        break;
      case 'createAccount':
        connexionController.createAccount(request, response);
        break;
      case 'disconnect':
        mainController.sessionDisconnect(request, response);
        break;
      case 'lostPass':
        connexionController.lostPass(request, response);
        break;
      case 'deleteUser':
        connexionController.deleteUser(request, response);
        break;

      default:
        response.info = "La route get qu'elle n'existe !!";
        mainController.index(request, response);
        break;
    }
  },


  /*-------------- FORM CONTROL ------------*/
  /**
   * Controls wether the user informations matches usersDatabase
   */
  stdLoginControl: (request, response) => {
    const formPseudo = request.body.pseudo;
    const formPassword = request.body.password;

    // Ici on récupère les données user en BDD.
    connexionDB.getUser(formPseudo, (err, user) => {

      if (err) {

        console.log('erreur dans connexionDB.getUser :', err)
        response.info = 'Il y a eu une erreur, merci de réessayer';
        connexionViews.view(request, response);

      } else {

        // On continue si DBUser existe
        if (!user.rowCount) {

          response.info = 'Il doit y avoir une erreur de saisie...';
          connexionViews.view(request, response);

        } else {

          // https://www.npmjs.com/package/bcrypt
          bcrypt.compare(request.body.password, user.rows[0].password, (err, same) => {

            if (err) {

              console.log('erreur dans bcrypt hash :', err)
              response.info = 'Il y a eu une erreur, merci de réessayer';
              connexionViews.view(request, response);

            } else if (same) {

              // ici mettre les valeurs d'identification dans la session
              request.session.data.logguedIn = true;
              request.session.data.userInfos = user.rows[0];
              
              response.info = 'La connexion c bon'
              connexionViews.view(request, response);

            } else {

              response.info = 'Les mots de passe ne correspondent pas';
              connexionViews.view(request, response);
            }
          });
        }
      }
    })
  },

  /**
   * Controls if form's data are good enought to create an account...
   */
  createAccountControl: (request, response, next) => {
    // On récupère les données à contrôler :
    const formPseudo = request.body.pseudo;
    const formPassword_1 = request.body.password_1;
    const formPassword_2 = request.body.password_2;
    const formEmail_1 = request.body.email_1;
    const formEmail_2 = request.body.email_2;

    // Check empty form
    if (formPseudo === '' || formPassword_1 === '' || formEmail_1 === '') {

      response.info = 'Les champs sont mal remplis';
      connexionViews.view(request, response);


    } else {

      if (formPassword_1 !== formPassword_2) { // Passwords check

        response.info = 'Les mots de passe ne sont pas identiques';
        connexionViews.view(request, response);

      } else if (formEmail_1 !== formEmail_2) { // Emails check

        response.info = 'Les emails ne sont pas identiques';
        connexionViews.view(request, response);

      } else { // Check if Pseudo exists in DB

        connexionDB.getPseudo(formPseudo, (error, user) => {

          if (error) {
            console.log('error de la query getPseudo : ', error);

          } else {

            if (!user.rowCount) { // If pseudo doesn't exist

              // Ici on hash le password avant le stockage en BDD
              bcrypt.hash(formPassword_1, 10, (err, hash) => {

                if (err) {
                  console.log(err)

                } else {
                  // Ici function avec callback pour l'insertion du profil
                  connexionDB.insertProfil(formPseudo, hash, formEmail_1, (err, res) => {

                    if (err) {
                      console.log('error de la query insertProfil: ', err);
                      console.log('result', res);

                      response.info = 'Erreur, le mot de passe n\'a pas été enregistré dans la base';
                      connexionViews.view(request, response);

                    } else {
                      // Ici on renvoi vers le formulaire de connexion standard
                      request.params.pass = 'stdLogin';
                      response.info = 'Et maintenant on peut se connecter';
                      connexionViews.view(request, response);

                    }
                  });
                }
              })

            } else {
              // le pseudo est déjà pris:
              response.info = 'Le pseudo est déjà utilisé, il faut en choisir un autre';
              connexionViews.view(request, response);

            }
          }
        })
      }
    }
  },

  /**
   * Controls wether the lostPass' form is correct, that's a known email in database.
   */
  lostPasswordControl: (request, response) => {

    // Récup du formulaire
    const email = request.body.email;

    // Ici vérifier que l'email est en base de données
    connexionDB.isEmailInDB(email, (error, data) => {

      if (error) {
        console.log('dans lostPassWordControl - isEmailInDB :', error);
        response.redirect('/');

      } else {

        if (data.rowCount) {
          // console.log('isEmailInDB : ', data);
          // Ici remettre un mot de passe bidon en BDD
          connexionDB.insertDefaultPassword(data.rows[0].id, (error, results) => {

            if (error) {

              console.log('dans lostPassWordControl - insertDefaultPassword :', error);
              response.redirect('/');

            } else {
              console.log('results de insertDefaultPassword:', results);
              // Ici envoyer un email avec ce mot de passe bidon

              response.info = "C'est good, on a mis 'gpasdcerveau' comme mot de passe !";
              connexionViews.view(request, response);

            }
          })

        } else {

          response.info = 'Cet email qu\'il n\'existe en DB';
          connexionViews.view(request, response);

        }
      }
    })
  },

  /**
   * Supprime un user de la BDD
   */
  deleteUserControl: (request, response) => {

    connexionDB.deleteUser(request.body.id, (error, results) => {

      if (error) {

        console.log('dans deleteUser :', error);
        response.redirect('/');

      } else {

        response.info = "C'est good, il est plus dans la base";
        connexionViews.view(request, response);

      }
    })
  }
}

module.exports = connexionController;
