const connexionViews = require('../view/connexionViews');
const connexionDB = require('../model/connexionDB');
const bcrypt = require('bcrypt');
const generatePassword = require('generate-password');
const nodemailer = require('./../MW/nodemailer');


const {
  url,
  getGoogleAccountFromCode
} = require('../MW/googleLogin');


const connexionController = {

  /*-------------- VIEWS ----------------*/

  stdConnexion: (request, response) => {
    response.locals.urlGoogle = url;
    connexionViews.view(request, response)
  },

  createAccount: (request, response) => { connexionViews.view(request, response); },
  lostPass: (request, response) => { connexionViews.view(request, response); },
  deleteUser: (request, response) => { connexionViews.view(request, response); },

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
                    pseudo: `${formFirstName.substring(0,1)}-${formLastName.substring(0,1)}`,
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
   * Performs checkings over lost password request
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
          // Stocker les données utilisateur
          const user = data.rows[0];

          // Le mettre en DB
          const insertData = {
            id: user.id,
            // Ici générer un mot de passe aléatoire
            password: generatePassword.generate({
              length: 8,
              numbers: true,
            })
          }

          connexionDB.insertDefaultPassword(insertData, (error, results) => {

            if (error) {

              console.log('dans lostPassWordControl - insertDefaultPassword :', error);
              response.redirect('/');

            } else {
              // Ici je choisi de récupérer le mdp avec le retour de la BDD,
              // pour être sûr que ça a pas changé entre temps... overkill ? maybe...
              user.password = results.rows[0].password;

              // Sendmail personnifie le message envoyé
              nodemailer.sendLostPassMail(user, (error, info) => {

                if (error) {
                  console.log(error);

                } else {
                  console.log('results de insertDefaultPassword:', info.response);

                  response.info = "Un email est en route avec le nouveau mot de passe";
                  request.params.view = 'index';
                  connexionViews.view(request, response);

                }
              })
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

  //TODO................................................................
  /**
   * When a user responds to a "reinitialize password email", 
   * we have to make sure that everything is under control
   * @param {*} request 
   * @param {*} response 
   */
  checkDataMail: (request, response) => {

    // Ascertain code

    // if code ok set session détails

    // redirect to profile in order to set a new password


  }
}

module.exports = connexionController;
