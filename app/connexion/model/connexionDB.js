const client = require('./../../client');

/*-------------------------------------------------------------*/

const connexionDB = {

  getUser: function(pseudo, callback) {

    const query = `SELECT * FROM users 
    WHERE pseudo = '${pseudo}';`;

    client.query(query, callback)
  },

  getPseudo: function(pseudo, callback) {

    const query = `SELECT * FROM forum.users 
    WHERE pseudo='${pseudo}';`;

    client.query(query, callback)
  },

  insertProfil: function(pseudo, hashedPass, email, callback) {

    const query = `INSERT INTO forum.users (pseudo, password, email, status)
    VALUES ('${pseudo}', '${hashedPass}', '${email}', 'stdUser');`;

    client.query(query, callback)
  },

  isEmailInDB: (email, callback) => {

    const query = `SELECT * FROM forum.users WHERE email = '${email}';`;

    client.query(query, callback);
  },

  insertDefaultPassword: (id, callback) => {

    const query = `UPDATE forum.users
    SET password = 'gpasdcerveau'
    WHERE id = ${id};`

    client.query(query, callback);
  },

  deleteUser: (id, callback) => {

    const query = `DELETE FROM forum.users
    WHERE id = ${id};`

    client.query(query, callback);
  },
}

module.exports = connexionDB;
