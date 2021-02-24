const forumDB = require('../model/forumDB');
const forumView = require('../view/forumView');
const messageFormController = require('./messageFormController');

const forumController = {

  /*
   ** GET
   */

  //code for route /categories

  getCategories: async (request, response, next) => {

    try {
      // getting all categories from DB, i specify the callback to treat the result of the query
      const results = await forumDB.getCategories();

      forumView.categories(response, {
        categories: results.rows,
        session: request.session,
        info: response.info,
      });

    } catch (error) {

      // error first implementation checking for server errors
      // response.status(500).res("getcategories error: " + error.stack);
      forumView.categories(response, {
        categories: [],
        session: request.session,
        info: "getcategories error: " + error.stack,
      });
    }

  },

  // code for route /categories/:category

  getAllTopicsByCategoryId: async (request, response, next) => {

    try {
      const categoryName = request.params.categoryName;

      //First we get all the categories to generate the link in the navigation aside of the page
      let results = await forumDB.getCategories();
      const categories = results.rows;

      // we get the current category in the list form the request.param
      const currentCategory = categories.find(category => category.name === categoryName);
      if (!currentCategory) {
        throw new Error(`404 - Category "${categoryName}" not found`);
      }

      // now that i have the current category and the list of categories for the side menu, i need to get all topic by categoryId
      results = await forumDB.getTopicsByCategoryId(currentCategory.id);
      const topics = results.rows;

      forumView.category(response, {
        topics: topics,
        categories: categories,
        currentCategory,
        session: request.session,
        info: response.info,
      });

    } catch (error) {
      if (error.message.includes('404 -')) {
        response.info = error.message;
        next();
      } else {
        response.status(500).send(" getcategoryIdByName error: " + error.stack);
      }

    }
  },

  // code for la route /topics/:categoryName/:topicId

  getAllMessagesByTopicId: async (request, response, next) => {

    try {
      const topicId = +request.params.topicId;
      const catName = request.params.categoryName;
      // im expecting an integer in topicId, if anything else is passed, then 404
      if (isNaN(topicId)) {
        throw new Error(`404 -  no such topic exists with id = ${request.params.topicId}`);
      }

      //First i need to make sure the topic exists in this category
      let results = await forumDB.checkTopicExistsInCategory(topicId, catName);
      const currentTopic = results.rows[0];
      //if the topic doesnt exist, we go 404
      if (currentTopic === undefined) {
        throw new Error(`404 -  no such topic exists with id = ${request.params.topicId}`);
      }

      //then i need to get all the messages from this topic
      results = await forumDB.getAllMessagesByTopicId(topicId);

      const messages = results.rows;
      forumView.topic(response, {
        topic: currentTopic,
        messages,
        postUrl: request.url,
        session: request.session,
        info: response.info,
        jsFileUrl: "/js/topic.js"
      });

    } catch (error) {
      if (error.message.includes('404 -')) {
        response.info = error.message;
        next();
      } else {
        response.status(500).send(" getcategoryIdByName error: " + error.stack);
      }
    }
  },

  /*
   ** POST
   */

  // code for route /topics/:categoryName/post


  createNewTopic: async (request, response, next) => {

    // if (!request.session.data.logguedIn) {
    //   response.redirect(`/categories/${request.params.categoryName}`);
    //   return;
    // }

    try {
      const newTopic = {
        topicDesc: request.body.topic__desc.trim(),
        users_id: +request.session.data.userInfos.id,
        title: request.body.topic__title.trim()
      }
      const categoryName = request.params.categoryName;

      //...here i just make sure author, description and content are not empty
      if (!newTopic.topicDesc || !newTopic.title) {
        throw new Error('Empty fields - your Topic was not created because your title or message content was empty');
      }
      //we search the category id by its name store in req.params
      let results = await forumDB.getCategoryIdByName(categoryName);

      // if we have no results, then the url was wrong, changed by user
      if (!results.rows[0]) {
        throw new Error(`404 - no such category exists with name = ${categoryName}`);
      }

      // we get the id, add it to the object then send the info to createa the topic in the db
      newTopic.categoryId = results.rows[0].id;
      results = await forumDB.createNewTopic(newTopic);

      //we redirect to the topic list page
      response.redirect(`/categories/${request.params.categoryName}`);

    } catch (error) {

      if ((error.message.includes('404 -'))) {

        response.info = error.message;
        next();

      } else if ((error.message.includes('Empty fields -'))) {

        request.session.data.createError = error.message;

        response.redirect(`/categories/${request.params.categoryName}`);

      } else {

        response.status(500).send(" 505 - createtopic error: " + error.stack);

      }
    }
  },

  selectPOST: (request, response, next) => {
    const pass = request.params.pass;

    switch (pass) {
      case 'post':
        messageFormController.createNewMessage(request, response, next);
        break;
      case 'delete':
        messageFormController.deleteMessage(request, response, next);
        break;
      case 'edit':
        messageFormController.editMessage(request, response, next);
        break;
      default:
        response.redirect(`/topics/${request.params.categoryName}/${request.params.topicId}`);
        break;
    }
  },

};

module.exports = forumController;
