const googleTools = require('./../MW/googleTools');
const githubTools = require('./../MW/githubTools');
const connexionDB = require('./../model/connexionDB');

const APIController = {

  /**
   * After a user is identified, retrieve infos from google redirect url <code>
   * @param {Objet} request 
   * @param {Objet} response 
   */
  google: async (request, response) => {

    try {
      const dataUser = await googleTools.getGoogleAccountFromCode(request.query.code);

      if (dataUser) {

        APIController.manageDB(dataUser, request, response);

      } else {

        response.redirect('/connexion/stdLogin?msg_code=EC001');
      }
    } catch (error) {
      console.log(error)
      response.redirect('/connexion/stdLogin?msg_code=EC010');
    }
  },

  github: async (request, response) => {

    // console.log('github')
    try {

      const accessToken = await githubTools.getAccessTokenFromGithub(request, response)
      const dataUser = await githubTools.getUserFromToken(accessToken);
      // console.log(dataUser)

      if (dataUser) {

        APIController.manageDB(dataUser, request, response);

      } else {

        response.redirect('/connexion/stdLogin?msg_code=EC011');

      }
    } catch (error) {
      console.log(error)
      response.redirect('/connexion/stdLogin?msg_code=EC100');
    }
  },

  manageDB: (dataUser, request, response) => {
    // Ici on vérifie si l'utilisateur existe en DBUser
    connexionDB.getUserByEmail(dataUser.email, (err, res) => {

      if (err) { // Erreur dans la requête SELECT
        console.log(err)
        response.redirect('/connexion/stdLogin?msg_code=FC000');

      } else if (res.rows.length) {

        request.session.data.logguedIn = true;
        request.session.data.userInfos = res.rows[0];

        response.redirect('/categories?msg_code=IC000');

      } else {

        connexionDB.insertProfil(dataUser, (err, res) => {

          if (err) { // Erreur requête INSERT INTO
            console.log(err)
            response.redirect('/?msg_code=FC000')

          } else {
            // console.log('result', res);

            // ici mettre les valeurs d'identification dans la session
            request.session.data.logguedIn = true;
            request.session.data.userInfos = {
              id: res.rows[0].id,
              status: res.rows[0].status,
              pseudo: res.rows[0].pseudo
            }

            response.redirect('/categories?msg_code=IC000');
          }
        })
      }
    })
  }
}

module.exports = APIController;
