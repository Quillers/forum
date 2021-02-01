const forumView = {
    categories: (response, ejs) => {
        response.render('categories', ejs);
    },

    category: (response, ejs) => {
        response.render('category', ejs);
    },
    topic: (response, ejs) => {
        response.render('topic', ejs);
    },
};

module.exports = forumView;