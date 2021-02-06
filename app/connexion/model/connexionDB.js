const client = require('./../../client');

/*-------------------------------------------------------------*/

const connexionDB = {

  getUser: function(pseudo, password, callback) {

    const query = `SELECT * FROM module_connexion.users 
    WHERE pseudo = '${pseudo}'
    AND password = '${password}';`;

    try {
      client.query(query, callback)
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

    client.query(query, callback)
  },

  isEmailInDB: (email, callback) => {

    const query = `SELECT * FROM module_connexion.users WHERE email = '${email}';`;

    client.query(query, callback);
  },

  insertDefaultPassword: (id, callback) => {

    const query = `UPDATE module_connexion.users
    SET password = 'gpasdcerveau'
    WHERE id = ${id};`

    client.query(query, callback);
  },

  deleteUser: (id, callback) => {

    const query = `DELETE FROM module_connexion.users
    WHERE id = ${id};`

    client.query(query, callback);
  },
}

module.exports = connexionDB;
