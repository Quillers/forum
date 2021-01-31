const connexionViews = require('./../view/connexionViews');
const connexionDB = require('./../model/connexionDB');
const forumController = require('./../../forum/forumController');

const connexionController = {

  stdConnexion: function(request, response) {

    connexionController.setSessionVar(request, response, connexionViews.stdConnexion)
  },

  createAccount: (request, response) => {

    connexionController.setSessionVar(request, response, connexionViews.createAccount)
  },

  /**
   * Using ':pass', select what to do next :
   * ':pass' can take following values :
   *    - stdLogin,
   *    - createAccount,
   *    - lostPass,
   */
  selectRoute: (request, response) => {
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

      default:
        request.session.info = "La route post qu'elle n'existe !!";
        forumController.index(request, response)
        break;
    }
  },

  /**
   * Set the session' infos
   */
  setSessionVar: function(request, response, callback) {

    if (!request.session.loggedIn) {
      request.session.loggedIn = "loggedIn => visiteur, pas connecté";
    }

    callback(request, response);
  },

  sessionDisconnect: (request, response, next) => {

    request.session = null;

    response.redirect('/');
  },

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
        console.log('etape 5');
        request.session.loggedIn = 'Connecté via stdLoginControl';

        response.render('index', {
          loggedIn: request.session.loggedIn,
          info: '',
        });
        console.log('etape 6');

      } else {

        response.render('stdLogin', {
          loggedIn: request.session.loggedIn,
          info: "Pas de profil correspondant en DB",
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

  }
}

module.exports = connexionController;
