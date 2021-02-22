const forumDB = require('../model/forumDB');
const forumView = require('../view/forumView');

const forumController = {

  /*
   ** GET
   */

  //code associe a la route /categories

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

  // code associe a la route /categories/:category

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

  // code associe a la route /topics/:categoryName/:topicId

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

  // code associe a la route /topics/:categoryName/post


  createNewTopic: (request, response, next) => {

    if (!request.session.data.logguedIn) {
      response.redirect(`/categories/${request.params.categoryName}`);
      return;
    }

    const newTopic = {
      topicDesc: request.body.topic__desc.trim(),
      users_id: +request.session.data.userInfos.id,
      title: request.body.topic__title.trim()
    }
    const categoryName = request.params.categoryName;
    //TODO need to validate the data!!!! => saw a video about request header and validate from front JS

    //...here i just make sure author, description and content are not empty
    if (!newTopic.topicDesc || !newTopic.title) {
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

    if (!request.session.data.logguedIn) {
      response.redirect(`/topics/${request.params.categoryName}/${request.params.topicId}`);
      return;
    }

    const newMessage = {
      messageContent: request.body.message.trim(),
      users_id: +request.session.data.userInfos.id,
      topicId: +request.params.topicId
    }

    //TODO need to validate the data!!!! => saw a video about request header and validate from front JS

    //...here i just make sure author and content are not empty
    if (!newMessage.messageContent) {
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

  // code associe a la route /topics/:categoryName/:topicId/delete
  // middleware pour traiter la demande de suppression d un message par son id
  deleteMessage: (request, response, next) => {


    if (!request.session.data.logguedIn) {
      response.redirect(`/topics/${request.params.categoryName}/${request.params.topicId}`);
      return;
    }

    //objet de parametre qui sera envoye au datamapper
    const deleteParams = {
      // On recupere l id du message envoye via POST dans user form
      messageId: +request.body.deleteMessageId,
      // on recupere l'id de l utilisateur connecte qui a fait la demande de suppression du message 
      //(pour s assurer que ce soit bien son msg qu on va supprimer)
      users_id: request.session.data.userInfos.id,
    };

    //si la valeur de id envoye en post n est pas correct, erreur
    if (!deleteParams.messageId || isNaN(deleteParams.messageId)) {
      //
      console.log("le message Id n est pas bon, l'utilisateur a modifie notre form cache")
      next();
    }

    //on appelle le datamapper qui va envoyuer la requete de suppression
    forumDB.delMessageById(deleteParams, (err, results) => {

      if (err) {
        //gestion des erreurs
        response.status(500).send("deleteMessage error: " + err.stack);
      } else {
        if (!results.rowCount) {
          console.log("Message n a pas ete supprime, l utilisateur n avait pas les droits pour supprimer le message");
        }
        //message supprime avec succes, on redirect sur la page des 
        response.redirect(`/topics/${request.params.categoryName}/${request.params.topicId}`);
      }

    });
  },

  // code associe a la route /topics/:categoryName/:topicId/edit

  editMessage: (request, response, next) => {

    if (!request.session.data.logguedIn) {
      response.redirect(`/topics/${request.params.categoryName}/${request.params.topicId}`);
      return;
    }

    //objet de parametre qui sera envoye au datamapper
    const editParams = {

      // On recupere l id du message envoye via POST dans user form
      messageId: +request.body.modMessageId,

      // On recupere le message modifie par l'utilisateur
      message: request.body.modMessage.trim(),


      // on recupere l'id de l utilisateur connecte qui a fait la demande de suppression du message 
      //(pour s assurer que ce soit bien son msg qu on va supprimer)
      users_id: request.session.data.userInfos.id,
    };

    //si la valeur de id envoye en post n est pas correct, erreur
    if (!editParams.messageId || isNaN(editParams.messageId) || !editParams.message) {
      //
      console.log("le message Id n est pas bon, l'utilisateur a modifie notre form cache")
      next();
    }

    console.log(editParams);

    forumDB.updateMessage(editParams, (error, results) => {
      if (error) {
        response.status(500).send("deleteMessage error: " + err.stack);
      } else {
        if (!results.rowCount) {
          console.log("Message n a pas ete supprime, l utilisateur n avait pas les droits pour supprimer le message");
        }
        //message supprime avec succes, on redirect sur la page des 
        response.redirect(`/topics/${request.params.categoryName}/${request.params.topicId}`);
      }

    });

  },

};

module.exports = forumController;
