const client = require('../../client');

const forumDB = {

  getCategories: (callback) => {
    const query = `SELECT * from forum.category`;

    client.query(query, callback);
  },

  getCategoryIdByName: (categoryName, callback) => {
    const query = `SELECT id from forum.category WHERE name=$1`;

    client.query(query, [categoryName], callback);
  },

  getTopicsByCategoryId: (categoryId, callback) => {
    const query = `SELECT topic.*, users.pseudo FROM forum.topic JOIN forum.users ON forum.topic.users_id=forum.users.id WHERE category_id=$1 ORDER BY topic.created_at ASC`;

    client.query(query, [+categoryId], callback);
  },

  getTopicById: (topicId, callback) => {
    const query = `SELECT topic.*, users.pseudo FROM forum.topic JOIN forum.users ON forum.topic.users_id=forum.users.id WHERE id=$1`;

    client.query(query, [+topicId], callback);
  },
  // TEST ALL MESSAGES
  // this function query makes sure that a particular topic exists in this particular category 
  checkTopicExistsInCategory: (topicId, catName, callback) => {
    const query = `
    SELECT  *
    FROM forum.topic  JOIN forum.category ON forum.topic.category_id=category.id
                      JOIN forum.users ON forum.topic.users_id=forum.users.id
    WHERE forum.category.name=$1 AND forum.topic.id=$2 ORDER BY topic.created_at ASC`;

    client.query(query, [catName, +topicId], callback);
  },

  getAllMessagesByTopicId: (topicId, callback) => {
    const query = `SELECT message.*, users.pseudo FROM forum.message JOIN forum.users ON message.users_id=users.id WHERE topic_id=$1 ORDER BY message.created_at ASC`;

    client.query(query, [+topicId], callback);
  },

  createNewTopic: (newTopic, callback) => {
    const query = `INSERT INTO forum.topic (title, topic_description, users_id, category_id) VALUES
        ($1, $2, $3, $4)`;
    client.query(query, [newTopic.title, newTopic.topicDesc, newTopic.users_id, newTopic.categoryId], callback);
  },

  createNewMessage: (newMessage, callback) => {
    const query = `INSERT INTO forum.message (users_id, message_content, topic_id) VALUES
        ($1, $2, $3)`;
    client.query(query, [newMessage.users_id, newMessage.messageContent, newMessage.topicId], callback);
  },

  delMessageById: (objParams, callback) => {
    const preparedQuery= {
      text: `DELETE FROM "forum"."message" WHERE id=$1 AND users_id=$2;
      `,
      values: [objParams.messageId, objParams.users_id]
     }
    client.query(preparedQuery, callback);

  },

};

module.exports = forumDB;
