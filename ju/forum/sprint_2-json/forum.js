const path = require('path');

const express = require('express');
const app = express();
const port = 3000;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('public'));


app.get('/', (request, response) => {
    // response.sendFile(path.join(__dirname,  './views/index.html'));
    response.render('index', {test: 'Valentin'});
});

app.listen(port);