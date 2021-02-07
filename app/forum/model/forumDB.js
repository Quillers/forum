const client = require('./../../client');

const forumDB = {

  getCategories: (callback) => {
    const query = `SELECT * from category`;

    client.query(query, callback);
  },

  getCategoryIdByName: (categoryName, callback) => {
    const query = `SELECT "id" from category WHERE "name"=$1`;

    client.query(query, [categoryName], callback);
  },

  getTopicsByCategoryId: (categoryId, callback) => {
    const query = `SELECT * from topic WHERE "category_id"=$1`;

    client.query(query, [+categoryId], callback);
  },
  getTopicById: (topicId, callback) => {
    const query = `SELECT * from topic WHERE "id"=$1`;

    client.query(query, [+topicId], callback);
  },
  getAllMessagesByTopicId: (topicId, callback) => {
    const query = `SELECT * from message WHERE "topic_id"=$1`;

    client.query(query, [+topicId], callback);
  },

  // TEST ALL MESSAGES

  getAllMessagesByTopicIdAndCatName: (topicId, catName, callback) => {
    const query = `
    SELECT  message.*,
            topic.title,
            topic.topic_description,
            topic.author AS "topic_author",
            topic.created_at AS "topic_created_at",
            topic.modified_at AS "topic_modified_at"
    FROM topic "topic"    JOIN message "message" ON topic.id=message.topic_id
                                JOIN category "category" ON topic.category_id=category.id
    WHERE category.name=$1 AND topic.id=$2`;

    client.query(query, [catName, +topicId], callback);
  },



  createNewTopic: (newTopic, callback) => {
    const query = `INSERT INTO topic ("title", "topic_description", "author", "category_id") VALUES
        ($1, $2, $3, $4)`;
    client.query(query, [newTopic.title, newTopic.topicDesc, newTopic.author, newTopic.categoryId], callback);
  },
  createNewMessage: (newMessage, callback) => {
    const query = `INSERT INTO message ("author", "message_content", "topic_id") VALUES
        ($1, $2, $3)`;
    client.query(query, [newMessage.author, newMessage.messageContent, newMessage.topicId], callback);
  },
};

module.exports = forumDB;
