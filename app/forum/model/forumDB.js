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
    const query = `SELECT * from forum.topic WHERE category_id=$1`;

    client.query(query, [+categoryId], callback);
  },

  getTopicById: (topicId, callback) => {
    const query = `SELECT * from forum.topic WHERE id=$1`;

    client.query(query, [+topicId], callback);
  },
  // TEST ALL MESSAGES
  // this function query makes sure that a particular topic exists in this particular category 
  checkTopicExistsInCategory: (topicId, catName, callback) => {
    const query = `
    SELECT  *
    FROM forum.topic JOIN forum.category ON forum.topic.category_id=category.id
    WHERE forum.category.name=$1 AND forum.topic.id=$2`;

    client.query(query, [catName, +topicId], callback);
  },

  getAllMessagesByTopicId: (topicId, callback) => {
    const query = `SELECT * from forum.message WHERE topic_id=$1`;

    client.query(query, [+topicId], callback);
  },

  createNewTopic: (newTopic, callback) => {
    const query = `INSERT INTO forum.topic ("title", "topic_description", "author", "category_id") VALUES
        ($1, $2, $3, $4)`;
    client.query(query, [newTopic.title, newTopic.topicDesc, newTopic.author, newTopic.categoryId], callback);
  },

  createNewMessage: (newMessage, callback) => {
    const query = `INSERT INTO forum.message ("author", "message_content", "topic_id") VALUES
        ($1, $2, $3)`;
    client.query(query, [newMessage.author, newMessage.messageContent, newMessage.topicId], callback);
  },
};

module.exports = forumDB;
