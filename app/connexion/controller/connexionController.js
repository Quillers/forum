const connexionViews = require('../view/connexionViews');
const connexionDB = require('../model/connexionDB');
const bcrypt = require('bcrypt');
const generatePassword = require('generate-password');
const nodemailer = require('./../MW/nodemailer');

const { githubURL } = require('../MW/githubTools');
const { url } = require('../MW/googleTools');


const connexionController = {

  /*-------------- VIEWS ----------------*/

  stdConnexion: (request, response) => {
    response.locals.urlGoogle = url;
    response.locals.urlGithub = githubURL;

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
        response.redirect('/connexion/stdLogin?msg_code=FC000');

      } else {

        // On continue si DBUser existe
        if (!user.rowCount) {

          response.redirect('/connexion/stdLogin?msg_code=IC110')

        } else {

          // https://www.npmjs.com/package/bcrypt
          bcrypt.compare(request.body.password, user.rows[0].password, (err, same) => {

            if (err) {

              console.log('erreur dans bcrypt hash :', err)
              response.redirect('/connexion/stdLogin?msg_code=FC001')

            } else if (same) {

              // ici mettre les valeurs d'identification dans la session
              request.session.data.logguedIn = true;
              request.session.data.userInfos = user.rows[0];

              response.redirect('/categories?msg_code=IC000');

            } else {

              response.redirect('/connexion/stdLogin?msg_code=IC1001')
            }
          });
        }
      }
    })
  },

  /**
   * Controls if form's data are good enought to create an account...
   */
  createAccountControl: (request, response) => {
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

      response.redirect('/connexion/stdLogin?msg_code=IC1000');

    } else {

      if (formPassword_1 !== formPassword_2) { // Passwords check

        response.redirect('/connexion/stdLogin?msg_code=IC111')

      } else { // Check if Email exists in DB

        connexionDB.getEmail(formEmail, (error, user) => {

          if (error) {
            console.log('error de la query getPseudo : ', error);
            response.redirect('/connexion/stdLogin?msg_code=FC000')

          } else {

            if (!user.rowCount) { // If email doesn't exist

              // Ici on hash le password avant le stockage en BDD
              bcrypt.hash(formPassword_1, 10, (err, hash) => {

                if (err) {
                  console.log(err)
                  response.redirect('/connexion/stdLogin?msg_code=FC010');

                } else {

                  const dataUser = {
                    pseudo: `${formFirstName}-${formLastName}`,
                    firstName: formFirstName,
                    lastName: formLastName,
                    email: formEmail,
                    hashedPass: hash
                  }
                  // Ici function avec callback pour l'insertion du profil
                  connexionDB.insertProfil(dataUser, (err, res) => {

                    if (err) {
                      console.log('error de la query insertProfil: ', err);
                      response.redirect('/connexion/stdLogin?msg_code=FC000');

                    } else {
                      // TODO: Prévoir un envoi de mail pour confirmation de l'adresse mail
                      response.redirect('/connexion/stdLogin?msg_code=IC001');
                    }
                  });
                }
              })
            } else {
              // le pseudo est déjà pris:
              response.redirect('/connexion/stdLogin?msg_code=IC010');
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
        response.redirect('/connexion/stdLogin?msg_code=FC000');

      } else {

        if (data.rowCount) {
          // console.log('isEmailInDB : ', data);
          // Stocker les données utilisateur
          const user = data.rows[0];

          // Générer un nouveau mot de passe
          const newPassword = generatePassword.generate({
            length: 8,
            numbers: true,
          })

          // Le crypter avant de le mettre en DB
          // Le mettre en DB
          const insertData = {
            id: user.id,
            hashedPassword: bcrypt.hashSync(newPassword, 10)
          }

          connexionDB.insertDefaultPassword(insertData, (error, results) => {

            if (error) {

              console.log('dans lostPassWordControl - insertDefaultPassword :', error);
              response.redirect('/connexion/stdLogin?msg_code=FC000');

            } else {

              user.password = newPassword;

              // Sendmail personnifie le message envoyé
              nodemailer.sendLostPassMail(user, (error, info) => {

                if (error) {
                  console.log(error);
                  response.redirect('/connexion/stdLogin?msg_code=FC011');

                } else {
                  // console.log('results de insertDefaultPassword:', info.response);
                  response.redirect('/connexion/stdLogin?msg_code=IC011');
                }
              })
            }
          })
        } else {
          response.redirect('/connexion/stdLogin?msg_code=IC100')
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
        response.redirect('/connexion/stdLogin?msg_code=FC000');

      } else {

        response.redirect('/connexion/stdLogin?msg_code=IC101');
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
