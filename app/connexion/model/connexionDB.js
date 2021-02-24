const client = require('../../client');

/*-------------------------------------------------------------*/

const connexionDB = {
  getUserByPseudo: function(pseudo, callback) {

    const query = {
      text: `SELECT * FROM forum.users 
    WHERE pseudo=$1;`,
      values: [pseudo]
    }

    client.query(query, callback)
  },

  getUserByEmail: function(email, callback) {

    const query = {
      text: `SELECT * FROM forum.users 
    WHERE email=$1;`,
      values: [email]
    }

    client.query(query, callback)
  },

  getPseudo: function(pseudo, callback) {

    const query = {
      text: `SELECT * FROM forum.users 
    WHERE pseudo=$1;`,
      values: [pseudo]
    }

    client.query(query, callback)
  },

  getEmail: function(email, callback) {

    const query = {
      text: `SELECT * FROM forum.users 
    WHERE email=$1;`,
      values: [email]
    }

    client.query(query, callback)
  },
  insertProfil: function(dataUser, callback) {

    const query = {
      text: `INSERT INTO forum.users (pseudo, firstname, lastname, password, email, status)
    VALUES ($1, $2, $3, $4, $5, 'stdUser') RETURNING id, pseudo, status;`,
      values: [dataUser.pseudo, dataUser.firstName, dataUser.lastName, dataUser.hashedPass, dataUser.email]
    };

    client.query(query, callback)
  },

  isEmailInDB: (email, callback) => {

    const query = `SELECT * FROM forum.users WHERE email = '${email}';`;

    client.query(query, callback);
  },

  insertDefaultPassword: (data, callback) => {

    const query = {
      text: `UPDATE forum.users
    SET password = $1
    WHERE id = $2 RETURNING password;`,
      values: [data.hashedPassword, data.id]
    }

    client.query(query, callback);
  },

  deleteUser: (id, callback) => {

    const query = `DELETE FROM users
    WHERE id = ${id};`

    client.query(query, callback);
  },
}

module.exports = connexionDB;
