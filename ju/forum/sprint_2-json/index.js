/*---------- Imports --------------*/
const express = require('express');
const topicRouteur = require('./my_modules/topicRouteur');
const mw = require('./my_modules/mw');

/*----------- Variables -------------*/
const app = express();
const port = 3000;

/*----------- Routeur --------------*/
// on fixe le dossier pour récup des templates
app.set('views', './views');
// On utilise ejs comme moteur de templates
app.set('view engine', 'ejs');
// On indique d'utiliser le module de parsing pour récup les formulaires.
app.use(express.urlencoded({ extended: true }));
// public est le dossier par défaut.
app.use(express.static('./public'));
// On utilise le routeur défini
app.use(topicRouteur);
// On envoi 404 si la requête arrive jusqu'ici :
app.use(mw.throw404);
// On lance le serveur
app.listen(port, () => {
  console.log('serveur lancé sur le port ' + port);
});

/*---------------------------------------------------*/
/*---------------------------------------------------*/
// Le principe à ce stade :

// FRONTEND
// On arrive sur la page index, choix :
// OK => - Lien avec url selon nom du sujet ou
// A Faire => - Formulaire (nom + bouton) pour nouveau sujet (GET),

// BACKEND :
// - réceptionne l'url et route la demande vers l'action à entreprendre
// - Soit créer un nouveau sujet,
// - Soit afficher un sujet existant,

// FRONTEND
// Quand on valide le formulaire message, on récup le contenu avec formSubmitHandler.
// - ça crée un Message (pseudo, nom, date, sujet)
// - ça crée un MessageItem (Message), A FAIRE => une seule classe message,
// - ca envoi le message au serveur (requete XMLHttp),

// BACKEND
// - réceptionne la requête et met à jour le fichier json,
// - renvoi une page à jour.
