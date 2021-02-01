const client = require('./../../client');

/*-------------------------------------------------------------*/

const connexionDB = {

  getUser: function(pseudo, password, callback) {

    const query = `SELECT * FROM module_connexion.users 
    WHERE pseudo = '${pseudo}'
    AND password = '${password}';`;

    try {
      client.query(query, (error, results) => {
        if (error === null) {

          callback(results);

        } else {
          console.log('error de la query getUser : ', error);
        }
      });
    } catch (error) {
      console.log('error du bloc try getUser : ', error);
    }
  },

  getPseudo: function(pseudo, callback) {

    const query = `SELECT * FROM module_connexion.users 
    WHERE pseudo='${pseudo}';`;

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

  insertProfil: function(pseudo, password, email, callback) {

    const query = `INSERT INTO module_connexion.users (pseudo, password, email)
    VALUES ('${pseudo}', '${password}', '${email}');`;

    try {
      client.query(query, (error, result) => {
        if (error === null) {

          callback()

        } else {
          console.log('error de la query insertProfil: ', error);
        }
      });
    } catch (error) {
      console.log('error du bloc try insertProfil: ', error);
    }
  }
}

module.exports = connexionDB;