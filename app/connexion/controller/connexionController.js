const connexionViews = require('./../view/connexionViews');
const connexionDB = require('./../model/connexionDB');
const forumController = require('../../forum/controller/forumController');
const mainController = require('../../main/controller/mainController');
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
    console.log('etape 0', pass);

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

    // Ici un e fonction qui récupère la requête.
    connexionDB.getUser(formPseudo, formPassword, (user) => {

      // On continue si DBUser existe et que les passwords concordent
      if (user.rowCount) {
        // ici mettre les valeurs d'identification dans la session
        request.session.data.logguedIn = true;
        request.session.data.userStatus = user.rows[0].userStatus;
        response.info = 'La connexion c bon'
        response.render('index', {
          session: request.session,
          info: response.info
        });

      } else {
        response.info = 'La base ne renvoie rien';
        response.render('stdLogin', {
          session: request.session,
          info: response.info
        });
      }
    });
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

      response.render('createAccount', {
        info: 'Les champs sont mal remplis',
        loggedIn: request.session.loggedIn,
      });

    } else {

      if (formPassword_1 !== formPassword_2) { // Passwords check

        response.render('createAccount', {
          info: 'Les mots de passe ne sont pas identiques',
          loggedIn: request.session.loggedIn,
        });

      } else if (formEmail_1 !== formEmail_2) { // Emails check

        response.render('createAccount', {
          info: 'Les emails ne sont pas identiques',
          loggedIn: request.session.loggedIn,
        });

      } else { // Check if Pseudo exists in DB

        connexionDB.getPseudo(formPseudo, (user) => {

          if (!user.rowCount) { // If pseudo doesn't exist

            // Ici function avec callback pour l'insertion du profil
            connexionDB.insertProfil(formPseudo, formPassword_1, formEmail_1, () => {

              // Le render car tout est bon
              response.render('stdLogin', {
                info: 'Et maintenant on peut se connecter',
                loggedIn: request.session.loggedIn,

              });
            })
          } else {
            // le pseudo est déjà pris:
            response.render('createAccount', {
              info: 'Le pseudo est déjà utilisé, il faut en choisir un autre',
              loggedIn: request.session.loggedIn,
            });
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

              response.render('lostPass', {
                info: "C'est good, on a mis 'gpasdcerveau' comme mot de passe !",
                loggedIn: request.session.loggedIn,
              });
            }
          })

        } else {
          response.render('lostPass', {
            info: 'Cet email qu\'il n\'existe en DB',
            loggedIn: request.session.loggedIn,
          });
        }
      }
    })
  },

  /**
   * Supprime un user de la BDD
   */
  deleteUserControl: (request, response) => {
    const userId = request.body.id;

    connexionDB.deleteUser(userId, (error, results) => {

      if (error) {

        console.log('dans deleteUser :', error);
        response.redirect('/');

      } else {
        console.log('results de deleteUser:', results);

        response.render('deleteUser', {
          info: "C'est good, il est plus dans la base",
          loggedIn: request.session.loggedIn,
        });
      }
    })
  }
}

module.exports = connexionController;
