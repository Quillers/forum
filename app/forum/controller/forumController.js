
const forumDB = require('../model/forumDB');
const forumView = require('../view/forumView');

const forumController = {

  /*
  ** GET
  */

  //code associe a la route /categories

  getCategories: (request, response, next) => {
    // getting all categories from DB, i specify the callback to treat the result of the query
    forumDB.getCategories((err, results) => {
      if (err) {
        // error first implementation checking for server errors
        response.status(500).res("getcategories error: " + error.stack);
      } else {

        forumView.categories(response, {
          categories: results.rows,
          loggedIn: request.session.loggedIn,
          info: request.session.info,
        });
      }
    });
  },

  // code associe a la route /categories/:category

  getAllTopicsByCategoryId: (request, response, next) => {

    const categoryName = request.params.categoryName;
    //First we get the id corresponding to the category name
    forumDB.getCategoryIdByName(categoryName, (err, results) => {
      if (err) {
        // checking for server Error
        response.status(500).send(" getcategoryIdByName error: " + err.stack);

      } else {

        //if we don't get a result for the category, then it's a not found error
        if (!results.rows[0]) {
          //TODO we need to implement a middleware for the 404 then we use the code
          //next();
          response.status(404).send(`404 NOT FOUND: no such category exists ${categoryName}`);

        } else {
          const categoryId = results.rows[0].id;

          //if no 404, we then get all the topics from the categoryId
          forumDB.getTopicsByCategoryId(categoryId, (err, results) => {
            if (err) {
              // checking for server Error
              response.status(500).send(" getTopicsByCategoryId error: " + err.stack);

            } else {
              const topics = results.rows;

              forumView.category(response, {
                topics: topics,
                categoryName,
                loggedIn: request.session.loggedIn,
                info: request.session.info,
              });
            }
          });
        }
      }
    });

  },

  // code associe a la route /topics/:categoryName/:topicId

  getAllMessagesByTopicId: (request, response, next) => {
    const topicId = +request.params.topicId;

    // im expecting an int in topicId, if anything else is passed, then 404
    if (isNaN(topicId)) {
      //TODO we need to implement a middleware for the 404 then we use the code
      next();
      return ;
      //response.status(404).send(`404 NOT FOUND: no such topic exists with id = ${request.params.topicId}`);
    }

    forumDB.getTopicById(topicId, (err, results) => {
      if (err) {
        // checking for server Error
        response.status(500).send(" getAllMessagesByTopicId error: " + err.stack);

      } else {
        const currentTopic = results.rows[0];
        //we need to check if the topic exists and handle the 404
        if (!currentTopic) {
          //TODO we need to implement a middleware for the 404 then we use the code
          next();
          //response.status(404).send(`404 NOT FOUND: no such topic exists with id = ${topicId}`);
        } else {

          forumDB.getAllMessagesByTopicId(topicId, (err, results) => {
            if (err) {
              // checking for server Error
              response.status(500).send(" getAllMessagesByTopicId error: " + err.stack);

            } else {
              const messages = results.rows;
              // We populate the object ejs to pass to the view then we call the method that manage the render
              forumView.topic(response, {
                topic: currentTopic,
                messages,
                postUrl: request.url + '/post',
                loggedIn: request.session.loggedIn,
                info: request.session.info,
              });
            }
          });
        }
      }
    });

  },

  /*
  ** POST
  */

  // code associe a la route /topics/:categoryName/post


  createNewTopic: (request, response, next) => {
    const newTopic = {
      topicDesc: request.body.topic__desc,
      author: request.body.topic__username,
      title: request.body.topic__title
    }
    const categoryName = request.params.categoryName;
    //TODO need to validate the data!!!! => saw a video about request header and validate from front JS

    //...here i just make sure author, description and content are not empty
    if (!newTopic.author || !newTopic.topicDesc || !newTopic.title) {
      response.send(`
            <h1>Recommencez votre topic, vous avez oublie quelque chose</h1>
            <a href="/categories/${request.params.categoryName}">Retourner a la liste des sujets</a>
            `);
    } else {
      forumDB.getCategoryIdByName(categoryName, (err, results) => {
        if (err) {
          // checking for server Error
          response.status(500).send(" getCategoryIdByName createtopic error: " + err.stack);
        } else {
          if (!results.rows[0]) {
            //TODO we need to implement a middleware for the 404 then we use the code
            //next();
            response.status(404).send(`404 NOT FOUND: no such category exists with name = ${categoryName}`);
          } else {
            newTopic.categoryId = results.rows[0].id;
            forumDB.createNewTopic(newTopic, (err, results) => {
              if (err) {
                // checking for server Error
                response.status(500).send("createNewTopic error: " + err.stack);
              } else {
                response.redirect(`/categories/${request.params.categoryName}`);
              }
            });
          }
        }
      });

    }
  },

  // code associe a la route /topics/:categoryName/:topicId/post

  createNewMessage: (request, response, next) => {
    const newMessage = {
      messageContent: request.body.message,
      author: request.body.username,
      topicId: +request.params.topicId
    }

    //TODO need to validate the data!!!! => saw a video about request header and validate from front JS

    //...here i just make sure author and content are not empty
    if (!newMessage.author || !newMessage.messageContent) {
      response.send(`
            <h1>Recommencez votre message, vous avez oublie quelque chose</h1>
            <a href="/">Retourner a la liste des sujets</a>
            `);
    } else {
      forumDB.createNewMessage(newMessage, (err, results) => {
        if (err) {
          // checking for server Error
          response.status(500).send("createNewMessage error: " + err.stack);
        } else {
          response.redirect(`/topics/${request.params.categoryName}/${request.params.topicId}`);
        }
      });
    }
  },

};

module.exports = forumController;