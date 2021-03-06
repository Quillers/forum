const client = require('../../client');

const forumDB = {

  // thanks to closure, i manage to pass arguments to the client.query callback
  promiseCB: function (resolve, reject) {
    return (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    }
  },
  
  /*
  **  READ QUERIES
  */
  
  getCategories: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * from forum.category`;

      client.query(query, forumDB.promiseCB(resolve, reject));
    })
  },

  getCategoryIdByName: (categoryName) => {
    return new Promise((resolve, reject) => {

      const query = `SELECT id from forum.category WHERE name=$1`;

      client.query(query, [categoryName], forumDB.promiseCB(resolve, reject));
    });
  },

  getTopicsByCategoryId: (categoryId) => {
    return new Promise((resolve, reject) => {

      const query = `SELECT topic.*, users.pseudo FROM forum.topic JOIN forum.users ON forum.topic.users_id=forum.users.id WHERE category_id=$1 ORDER BY topic.created_at ASC`;

      client.query(query, [+categoryId], forumDB.promiseCB(resolve, reject));
    });

  },

  // TEST ALL MESSAGES
  // this function query makes sure that a particular topic exists in this particular category 
  checkTopicExistsInCategory: (topicId, catName) => {
    return new Promise((resolve, reject) => {

      const query = `
      SELECT  *
      FROM forum.topic  JOIN forum.category ON forum.topic.category_id=category.id
                        JOIN forum.users ON forum.topic.users_id=forum.users.id
      WHERE forum.category.name=$1 AND forum.topic.id=$2 ORDER BY topic.created_at ASC`;

      client.query(query, [catName, +topicId], forumDB.promiseCB(resolve, reject));
    });
  },

  getAllMessagesByTopicId: (topicId) => {
    return new Promise((resolve, reject) => {

      const query = `SELECT message.*, users.pseudo FROM forum.message JOIN forum.users ON message.users_id=users.id WHERE topic_id=$1 ORDER BY message.created_at ASC`;

      client.query(query, [+topicId], forumDB.promiseCB(resolve, reject));
    });
  },

  /*
  **  CREATE QUERIES
  */

  createNewTopic: (newTopic) => {
    return new Promise((resolve, reject) => {

    const query = `INSERT INTO forum.topic (title, topic_description, users_id, category_id) VALUES
        ($1, $2, $3, $4)`;
    client.query(query, [newTopic.title, newTopic.topicDesc, newTopic.users_id, newTopic.categoryId], forumDB.promiseCB(resolve, reject));
  });

  },

  createNewMessage: (newMessage) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO forum.message (users_id, message_content, topic_id) VALUES
          ($1, $2, $3)`;
      client.query(query, [newMessage.users_id, newMessage.messageContent, newMessage.topicId], forumDB.promiseCB(resolve, reject));
    });
  },

  /*
  **  DELETE QUERIES
  */

  delMessageById: (objParams) => {
    return new Promise((resolve, reject) => {

      const preparedQuery = {
        text: `DELETE FROM "forum"."message" WHERE id=$1 AND users_id=$2;`,

        values: [objParams.messageId, objParams.users_id]
      }
      client.query(preparedQuery, forumDB.promiseCB(resolve, reject));
    });
  },

  /*
  **  UPDATE QUERIES
  */

  updateMessage: (objParams, callback) => {
    return new Promise((resolve, reject) => {

      const preparedQuery = {
        text: ` UPDATE "forum"."message"
                  SET "message_content" = $1, 
                      "modified_at" = CURRENT_TIMESTAMP
                  WHERE id=$2 AND users_id=$3;
        `,
        values: [objParams.message, objParams.messageId, objParams.users_id]
      }
      client.query(preparedQuery, forumDB.promiseCB(resolve, reject));
    });
  }

};

module.exports = forumDB;
