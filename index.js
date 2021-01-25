/* 
** include express
*/
const express = require('express');
const router = require('./my_modules/router')

const app = express();


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

//use the router

app.use(router)


/* 
** start server and listen to port
*/

app.listen(port, console.log('server started at port: ', port));