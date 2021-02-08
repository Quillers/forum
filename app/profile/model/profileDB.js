const client = require('./../../client');

const profileDB = {

    getUserInfo: (id, callback) => {

        // In order to be sure id is a number, let parseint it
        const userID = parseInt(id);
        // Find the user informations in the database with its ID
        const query = `SELECT * FROM module_connexion.users WHERE id = ${userID};`;

        // The error or results will be managed by the callback function so we just pass it to the callback
        client.query(query, callback);
    },

    checkUserPseudo: (pseudo, callback) => {
        const query = `SELECT * FROM module_connexion.users WHERE pseudo='${pseudo}';`;

        try {
        client.query(query, (error, results) => {
            if (error === null) {
            //...
            callback(results)

            } else {
            console.log('error de la query : ', error);
            }
        });
        } catch (error) {
        console.log('error du bloc try : ', error);
        }
    },

    updateUserPseudo: (id, newPseudo, callback) => {
        
        const userID = parseInt(id);
        const query = `UPDATE module_connexion.users SET pseudo = '${newPseudo}' WHERE id = ${userID};`;

    try {
      client.query(query, (error, result) => {
        if (error === null) {

          callback(result);

        } else {
          console.log('error de la query update: ', error);
        }
      });
    } catch (error) {
      console.log('error du bloc try updatepseudo: ', error);
    }
  },
        
        
    }

}

module.exports = profileDB;