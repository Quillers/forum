module.exports =
  /**
   * After a user is identified, retrieve infos from google redirect url <code>
   * @param {Objet} request 
   * @param {Objet} response 
   */
  async (request, response) => {

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

            if (err) {
              response.info = err;
              response.redirect('/');
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
    } catch (error) {
      console.log(error)
      response.info = 'Aïe, le profile n\'a pas été enregistré dans la base';
      connexionViews.view(request, response);
    }
  }
