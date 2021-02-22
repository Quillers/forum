const connexionViews = require('../view/connexionViews');
const connexionDB = require('../model/connexionDB');
const mainController = require('../../main/controller/mainController');
const bcrypt = require('bcrypt');

const {
  url,
  getGoogleAccountFromCode
} = require('./googleLogin');


const connexionController = {

  /*-------------- VIEWS ----------------*/

  stdConnexion: (request, response) => {
    response.locals.urlGoogle = url;
    connexionViews.view(request, response)
  },

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
    const formEmail = request.body.email;

    // Ici on récupère les données user en BDD.
    connexionDB.getUserByEmail(formEmail, (err, user) => {

      if (err) {

        console.log('erreur dans connexionDB.getUserByEmail :', err)
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

              response.info = 'La connexion c bon';
              response.redirect('/categories');

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
    const formFirstName = request.body.first_name;
    const formLastName = request.body.last_name;
    const formEmail = request.body.email;
    const formPassword_1 = request.body.password_1;
    const formPassword_2 = request.body.password_2;

    // Ici on fixe la vue à afficher lors du render
    request.params.pass = 'stdLogin';

    // Check empty form
    if (
      formFirstName === '' ||
      formLastName === '' ||
      formEmail === '' ||
      formPassword_1 === ''
    ) {

      response.info = 'Les champs sont mal remplis';
      connexionViews.view(request, response);

    } else {

      if (formPassword_1 !== formPassword_2) { // Passwords check

        response.info = 'Les mots de passe ne sont pas identiques';
        connexionViews.view(request, response);


      } else { // Check if Email exists in DB

        connexionDB.getEmail(formEmail, (error, user) => {

          if (error) {
            console.log('error de la query getPseudo : ', error);

          } else {

            if (!user.rowCount) { // If pseudo doesn't exist

              // Ici on hash le password avant le stockage en BDD
              bcrypt.hash(formPassword_1, 10, (err, hash) => {

                if (err) {
                  console.log(err)

                } else {

                  const dataUser = {
                    pseudo: `${formFirstName.subString(0,1)}-${formLastName.subString(0,1)}`,
                    firstName: formFirstName,
                    lastName: formLastName,
                    email: formEmail,
                    hashedPass: hash
                  }
                  // Ici function avec callback pour l'insertion du profil
                  connexionDB.insertProfil(dataUser, (err, res) => {

                    if (err) {
                      console.log('error de la query insertProfil: ', err);
                      console.log('result', res);

                      response.info = 'Erreur, le mot de passe n\'a pas été enregistré dans la base';
                      connexionViews.view(request, response);

                    } else {
                      // TODO: Prévoir un envoi de mail pour confirmation de l'adresse mail


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
  },

  /**
   * After a user is identified, retrieve infos from google redirect url <code>
   * @param {Objet} request 
   * @param {Objet} response 
   */
  getUserInfoFromGoogle: async (request, response) => {

    try {
      const dataUser = await getGoogleAccountFromCode(request.query.code);

      // Ici on vérifie si l'utilisateur existe en DBUser
      connexionDB.getUserByEmail(dataUser.email, (err, res) => {

        if (res.rows.length) {

          request.session.data.logguedIn = true;
          request.session.data.userInfos = res.rows[0];

          response.redirect('/categories');

        } else {

          connexionDB.insertProfil(dataUser, (err, res) => {

            console.log('result', res);

            // Ici faire la connexion directement :
            // ici mettre les valeurs d'identification dans la session
            request.session.data.logguedIn = true;
            request.session.data.userInfos = {
              id: res.rows[0].id,
              status: res.rows[0].status,
              pseudo: `${dataUser.firstName} ${dataUser.lastName}`
            }

            response.redirect('/categories');

          })
        }
      })
    } catch (error) {
      console.log(error)
      response.info = 'Aïe, le profile n\'a pas été enregistré dans la base';
      connexionViews.view(request, response);
    }
  }
}

module.exports = connexionController;
