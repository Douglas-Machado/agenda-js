const express = require('express');
const route = express.Router(); //router do express

const homeController = require('./src/controllers/homeController') //importando homeController
const loginController = require('./src/controllers/loginController')

route.get('/', homeController.index) //dizendo que o index da página ou '/' é a rota do homeController

//rota de login
route.get('/login', loginController.index)
route.post('/login/register', loginController.register);

module.exports = route //exportando a rota para ser usada no server.js 