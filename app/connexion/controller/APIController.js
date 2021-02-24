const googleTools = require('./../MW/googleTools');
const githubTools = require('./../MW/githubTools');
const connexionViews = require('./../view/connexionViews');
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

      }
    } catch (error) {

      console.log(error)
      response.info = 'Aïe, le profile n\'a pas été enregistré dans la base';
      request.params.view = 'stdLogin';
      connexionViews.view(request, response);

    }
  },

  github: async (request, response) => {

    console.log('github')
    try {

      const accessToken = await githubTools.getAccessTokenFromGithub(request, response)
      const dataUser = await githubTools.getUserFromToken(accessToken);

      console.log(dataUser)

      if (dataUser) {

        APIController.manageDB(dataUser, request, response);

      } else {

        response.info = 'Aïe, le profile n\'a pas été enregistré dans la base';
        request.params.view = 'stdLogin';
        connexionViews.view(request, response);

      }

    } catch (error) {
      console.log(error)
      response.info = 'Aïe, le profile n\'a pas été enregistré dans la base';
      request.params.view = 'stdLogin';
      connexionViews.view(request, response);

    }
  },

  manageDB: (dataUser, request, response) => {
    // Ici on vérifie si l'utilisateur existe en DBUser
    connexionDB.getUserByEmail(dataUser.email, (err, res) => {

      if (err) {
        console.log(err)
        response.info = 'Aïe, le profile n\'a pas été enregistré dans la base';
        request.params.view = 'stdLogin';
        connexionViews.view(request, response);

      } else if (res.rows.length) {

        request.session.data.logguedIn = true;
        request.session.data.userInfos = res.rows[0];

        response.redirect('/categories');

      } else {

        connexionDB.insertProfil(dataUser, (err, res) => {

          if (err) {
            console.log(err)
            response.info = 'Aïe, le profile n\'a pas été enregistré dans la base';
            request.params.view = 'stdLogin';
            connexionViews.view(request, response);

          } else {

            console.log('result', res);

            // Ici faire la connexion directement :
            // ici mettre les valeurs d'identification dans la session
            request.session.data.logguedIn = true;
            request.session.data.userInfos = {
              id: res.rows[0].id,
              status: res.rows[0].status,
              pseudo: res.rows[0].pseudo
            }

            response.redirect('/categories');
          }
        })
      }
    })
  }
}

module.exports = APIController;
