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

    updateUserPseudo: (id, newPseudo, callback) => {
        
        const userID = parseInt(id);
        
        
    }

}

module.exports = profileDB;