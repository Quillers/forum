const express = require('express');
require('dotenv')
  .config();
const router = require('./app/router');
const connexionViews = require('./app/connexion/view/connexionViews');
const app = express();

// Les variables d'env sont rechargées dans chaque module si besoin
// et définies dans .env


const cookieSession = require('cookie-session');



// user urlencoded to get data from post

app.use(express.urlencoded({ extended: false }));


/*
 ** set functionnalities
 */
// set views directory
app.set('views', './views');
//set template engine to ejs
app.set('view engine', 'ejs');
//set the static file directory

// On utilise 'cookie-session' 
// http://expressjs.com/en/resources/middleware/cookie-session.html
app.use(
  cookieSession({
    name: 'session',
    secret: 'quiller',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
);

app.use(express.static('public'));

// We create a Global variable where we store the categories list (that s ok bc it will only be modified by the admins)

//use the router
app.use(router);

// A la fin la page 404 si besoin
app.use(connexionViews.page404);
/*------------------------------------------*/

app.listen(process.env.PORT, console.log('server started at html://localhost:', process.env.PORT));