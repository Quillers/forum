const client = require('./../../client');

/*-------------------------------------------------------------*/

const connexionDB = {

  getUser: function(pseudo, callback) {

    const query = {
      text: `SELECT * FROM users 
    WHERE pseudo=$1;`,
      values: [pseudo]
    }

    client.query(query, callback)
  },

  getPseudo: function(pseudo, callback) {

    const query = {
      text: `SELECT * FROM users 
    WHERE pseudo=$1;`,
      values: [pseudo]
    }

    client.query(query, callback)
  },

  insertProfil: function(pseudo, hashedPass, email, callback) {

    const query = {
      text: `INSERT INTO users (pseudo, password, email, status)
    VALUES ('${pseudo}', '${hashedPass}', '${email}', 'stdUser');`,
      values: [pseudo, hashedPass, email, 'stdUser']
    };

    client.query(query, callback)
  },

  isEmailInDB: (email, callback) => {

    const query = `SELECT * FROM users WHERE email = '${email}';`;

    client.query(query, callback);
  },

  insertDefaultPassword: (id, callback) => {

    const query = `UPDATE users
    SET password = 'gpasdcerveau'
    WHERE id = ${id};`

    client.query(query, callback);
  },

  deleteUser: (id, callback) => {

    const query = `DELETE FROM users
    WHERE id = ${id};`

    client.query(query, callback);
  },
}

module.exports = connexionDB;
