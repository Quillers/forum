const client = require('./../../client');

const profileDB = {

    getUserInfo: (id, callback) => {

        // In order to be sure id is a number, let parseint it
        const userID = parseInt(id);
        // Find the user informations in the database with its ID
        const query = {
          text: `SELECT * FROM users WHERE id = $1;`,
          values: [userID]
        };

        // The error or results will be managed by the callback function so we just pass it to the callback
        client.query(query, callback);
    },

    getUserByPseudo: (pseudo, callback) => {
        const query = {
          text: `SELECT * FROM users WHERE pseudo = $1;`,
          values: [pseudo]
        };

        client.query(query, (error, results) => {
            if (error === null) {
            //...
            callback(results);

            } else {
            console.log('error de la query : ', error);
            }
        });
    },

    updateUserPseudo: (id, newPseudo, callback) => {
        
        const userID = parseInt(id);
        const query = {
          text: `UPDATE users SET pseudo = $2 WHERE id = $1;`,
          values: [id, newPseudo]
        };

      client.query(query, (error, result) => {
        if (error === null) {

          callback(result);

        } else {
          console.log('error de la query update: ', error);
        }
      });
  },
}


module.exports = profileDB;