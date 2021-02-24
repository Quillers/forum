const github_key_local = require('./github_key_local.json');
const axios = require('axios');


module.exports = {

  getAccessTokenFromGithub: async (request, response) => {

    // 1. On récupère un 'token' nous autorisant à faire des requête 
    // au nom de l'utilisateur qui vient de gentillement nous donner les droits
    try {
      const githubResponse = await axios
        .post(`https://github.com/login/oauth/access_token`, {

          client_id: github_key_local.client_id,
          client_secret: github_key_local.client_secret,
          code: request.query.code

        }, {

          headers: {
            accept: 'application/json'
          }
        })

      return githubResponse.data.access_token;

    } catch (err) {
      console.log(err);

      return false;
    };
  },

  getUserFromToken: async (accessToken) => {

    try {

      // 2. Avec le token récupéré on fait maintenant une nouvelle demande
      // à l'API github pour récupérer les infos publiques du user
      const user = await axios({

        method: 'get',
        url: `https://api.github.com/user`,

        headers: {
          Authorization: 'token ' + accessToken
        }
      })

      return {
        pseudo: user.data.login,
        firstName: null,
        lastName: null,
        hashedPass: accessToken,
        email: user.data.email
      };

    } catch (err) {
      console.log(err);

      return false;
    };
  },

  githubURL: `https://github.com/login/oauth/authorize?client_id=${github_key_local.client_id}`
}
