/*--------------- IMPORTS ----------------*/

const express = require('express')
const routeur = require('./my_modules/routeur')

/*--------------- VARIABLES --------------*/

const app = express()
const PORT = 3000

/*-------------- FUNCTIONS ---------------*/

app.use(express.static('./public'))
app.use(routeur)
app.listen(PORT, () => {
  console.log(`Ok le serveur est lancé, sur le port : ${PORT}`)
})

/*-------------- EXPORTS ----------------*/
