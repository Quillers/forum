/*---- Partie avec DB postgreSQL ------*/

const { Client } = require('pg');

// Les variables d'env sont rechargées dans chaque module si besoin
// et définies dans .env
require('dotenv').config();

// 'process' est une variable globale dispo partout dans le dossier
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_LOGIN,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

client.connect();

module.exports = {
  /**
   * Controls wether the user informations matches usersDatabase
   */
  stdLoginControl: (request, response) => {
    const formPseudo = request.body.pseudo;
    const formPassword = request.body.password;

    const query = `SELECT * FROM module_connexion.users 
    WHERE pseudo='${formPseudo}'
    AND password = '${formPassword}';`;

    try {
      client.query(query, (error, results) => {
        //
        if (error === null) {
          // On continue si DBUser existe et que les passwords concordent
          if (results.rows.length) {
            // ici mettre les valeurs d'identification dans la session
            response.render('index', {
              loggedIn: true,
              info: request.session.info,
            });
            //
          } else {
            //
            response.render('connexion', {
              loggedIn: false,
              info: "erreur dans l'enchainement des flash-backs...",
            });
          }
        } else {
          console.log('error de la query : ', error);
        }
      });
    } catch (error) {
      console.log('error du bloc try : ', error);
    }
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
    const formEmail_2 = request.body.email_1;

    // On vérifie que mots de passe, email et pseudo sont non-vides
    if (formPseudo === '' || formPassword_1 === '' || formEmail_1 === '') {
      // Les champs sont mal remplis
      response.render('createAccount', {
        info: 'Les champs sont mal remplis',
        loggedIn: request.session.loggedIn,
      });
      //
    } else {
      //
      if (formPassword_1 !== formPassword_2) {
        // On commence par contrôler si les deux mots de passe sont identiques
        // 'Les mots de passe ne sont pas identiques';
        response.render('createAccount', {
          info: 'Les mots de passe ne sont pas identiques',
          loggedIn: request.session.loggedIn,
        });
        //
      } else if (formEmail_1 !== formEmail_2) {
        // les emails ne sont pas identiques:
        response.render('createAccount', {
          info: 'Les emails ne sont pas identiques',
          loggedIn: request.session.loggedIn,
        });
        //
      } else {
        // C'est bon pour le mot de passe et l'email
        // Check if pseudo already exist in database
        const queryPseudo = `SELECT id 
          FROM module_connexion.users 
          WHERE pseudo = '${formPseudo}';`;

        try {
          client.query(queryPseudo, (error, results) => {
            //
            if (!results.rows) {
              // On continue les vérifs,
              response.render('createAccount', {
                info: 'c bon on peut continuer',
                loggedIn: request.session.loggedIn,
              });
              //
            } else {
              // le pseudo est déjà pris:
              response.render('createAccount', {
                info: 'Le pseudo est déjà utilisé, il faut en choisir un autre',
                loggedIn: request.session.loggedIn,
              });
            }
          });
        } catch (error) {
          console.log('error de try dans createAccountControl : ', error);
        }
      }
    }
  },
};

//     if () {

//       $pass_hache = password_hash($newPass1,PASSWORD_DEFAULT);

//       $affectedLines = insertNewProfil($newPseudo, $pass_hache, $email_1);

//       if ($affectedLines) {
//         $_SESSION['identification'] = 'Profil enregistré, tu peux te connecter';
//         header('Location: ./index.php');

//       } else {
//         $_SESSION['identification'] = 'Problème d\'enregistrement, désolé !';
//         header('Location: ./index.php');

//       }
//     } else {
//       $_SESSION['identification'] = "Désolé ce pseudo est déjà prit";
//       header('Location: ./index.php');

//   },
// };
