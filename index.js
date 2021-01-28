/*
 ** include express
 */
const express = require('express');
const router = require('./my_modules/router');

const app = express();
const session = require('express-session');

// user urlencoded to get data from post

app.use(express.urlencoded({ extended: false }));

const port = 3000;

/*
 ** set functionnalities
 */
// set views directory
app.set('views', './views');
//set template engine to ejs
app.set('view engine', 'ejs');
//set the static file directory
app.use(express.static('public'));

// On ouvre la session
app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: 'quillers',
    session: {
      loggedIn: false,
    },
    resave: true,
    saveUninitialized: false,
  })
);

// We create a Global variable where we store the categories list (that s ok bc it will only be modified by the admins)
app.locals.categories = require('./my_modules/database/categories.json');

//use the router
app.use(router);

/*
 ** start server and listen to port
 */

app.listen(port, console.log('server started at port: ', port));
