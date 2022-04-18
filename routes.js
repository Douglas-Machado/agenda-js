const express = require('express');
const route = express.Router(); //router do express

const homeController = require('./src/controllers/homeController') //importando homeController
const loginController = require('./src/controllers/loginController')
const contactController = require('./src/controllers/contactController')

const { loginRequired } = require('./src/middlewares/middleware')

route.get('/', homeController.index) //dizendo que o index da página ou '/' é a rota do homeController

//rota de login
route.get('/login', loginController.index)
route.post('/login/register', loginController.register);
route.post('/login/signIn', loginController.signIn);
route.get('/login/logOut', loginController.logOut);

//rotas de contato
route.get('/contact/index', loginRequired, contactController.index)
route.post('/contact/register', loginRequired, contactController.register)
route.get('/contact/index/:id', loginRequired, contactController.editIndex)
route.post('/contact/edit/:id', loginRequired, contactController.edit)
route.get('/contact/delete/:id', loginRequired, contactController.delete)

module.exports = route //exportando a rota para ser usada no server.js 