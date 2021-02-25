const forumDB = require('../model/forumDB');

const messageFormController = {

// code for route /topics/:categoryName/:topicId/post

createNewMessage: async (request, response, next) => {

    // if (!request.session.data.logguedIn) {
    //   response.redirect(`/topics/${request.params.categoryName}/${request.params.topicId}`);
    //   return;
    // }

    try {
      const newMessage = {
        messageContent: request.body.message.trim(),
        users_id: +request.session.data.userInfos.id,
        topicId: +request.params.topicId
      }

      if (!newMessage.messageContent) {
        throw new Error('Empty fields - your message was not created because your message content was empty')
      }

      let results = await forumDB.createNewMessage(newMessage);

      response.redirect(`/topics/${request.params.categoryName}/${request.params.topicId}`);


    } catch (error) {

      if ((error.message.includes('Empty fields -'))) {

        request.session.data.createError = error.message;

        response.redirect(`/topics/${request.params.categoryName}/${request.params.topicId}`);

      } else {

        response.status(500).send(" 505 - create message error: " + error.stack);

      }
    }
  },

  // code for route /topics/:categoryName/:topicId/delete

  deleteMessage: async (request, response, next) => {


    // if (!request.session.data.logguedIn) {
    //   response.redirect(`/topics/${request.params.categoryName}/${request.params.topicId}`);
    //   return;
    // }


    try {

      //parameter object that will be sent to the datamapper
      const deleteParams = {
        // We get the id we got in POST request in user form
        messageId: +request.body.deleteMessageId,
        // we get the id of the user who asked for deletion
        //(we'll make sure we re deleting one of his own message)
        users_id: request.session.data.userInfos.id,
      };

      // if we got no id or a bad one
      if (!deleteParams.messageId || isNaN(deleteParams.messageId)) {
        throw new Error("404 - We couldn't find which message you wanted to delete");
      }

      // we call the function responsible for executing the query
      const results = await forumDB.delMessageById(deleteParams);

      // if no rows were affected, we didn't find the message we wanted to delete
      if (!results.rowCount) {
        throw new Error("Message not deleted, You have not the right to delete this message");
      }
      //message successfully deleted we redirect to topic.ejs
      response.redirect(`/topics/${request.params.categoryName}/${request.params.topicId}`);

    } catch (error) { //error handling

      if ((error.message.includes('404 -'))) {

        response.info = error.message;
        next();

      } else if ((error.message.includes('Message not deleted'))) {
        request.session.data.deleteError = error.message;
        response.redirect(`/topics/${request.params.categoryName}/${request.params.topicId}`);

      } else {
        response.status(500).send(" 505 - delete message error: " + error.stack);
      }

    }
  },

  // code for route /topics/:categoryName/:topicId/edit

  editMessage: async (request, response, next) => {

    // if (!request.session.data.logguedIn) {
    //   response.redirect(`/topics/${request.params.categoryName}/${request.params.topicId}`);
    //   return;
    // }

    try {
      //parameter object that will be sent to the datamapper
      const editParams = {

        // We get the id we got in POST request in the edit form
        messageId: +request.body.modMessageId,

        // we get the new version of the message modified by the user
        message: request.body.modMessage.trim(),

        // we get the id of the user who asked for deletion
        //(we'll make sure we re editing one of his own message)
        users_id: request.session.data.userInfos.id,
      };

      //if the id is wrong or the message is empty, we do nothing and send an error msg to be displayed
      if (!editParams.messageId || isNaN(editParams.messageId) || !editParams.message) {
        throw new Error('404 - we didn t retrieve the message you wanted to edit');
      }

      let results = await forumDB.updateMessage(editParams);

      if (!results.rowCount) {
        throw new Error('Message was not modified - you have not the rigths to do so')
      }
      //message successfully edited, we now redirect to the adequate page
      response.redirect(`/topics/${request.params.categoryName}/${request.params.topicId}`);
    
    } catch (error) {
      if ((error.message.includes('404 -'))) {

        response.info = error.message;
        next();

      } else if ((error.message.includes('Message was not'))) {
        request.session.data.editError = error.message;
        response.redirect(`/topics/${request.params.categoryName}/${request.params.topicId}`);

      } else {
        response.status(500).send(" 505 - update Message: " + error.stack);
      }

    }
  },


};

module.exports = messageFormController;