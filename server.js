require('dotenv').config() //importando o arquivo .env
const path = require('path'); //path utilizado para trabalhar com diretórios, é padrão do node

const routes = require('./routes') //importando as rotas do arquivo routes

const session = require('express-session') //user session (cookie)
const MongoStore = require('connect-mongo')// utilizando para salvar a sessão na base de dados
const flash = require('connect-flash') //flash messages(erro, sucesso, info...)
// const helmet = require('helmet')
const csrf = require('csurf') //csrf token(segurança da aplicação)

const { globalMiddleware, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware') 
/* importando os middlewares utilizando a desestruturação */

/* express */
const express = require('express'); //express instalado com node
const app = express(); //'instanciando' o express para a const app

/* mongoose */
const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTIONSTRING) //conexão com o banco de dados utilizando variáveis de ambiente no arquivo dotenv
/* mongoose.connect() retorna um promise que será resolvida no código abaixo */
  .then(() => {
    app.emit('ready') //enviando um 'sinal' em caso de sucesso da conexão
    console.log('base de dados funconando')
}).catch(function (err) { //capturando o erro
  console.log('falha ao conectar a base de dados')
  console.log(err.message)
})


app.use(express.urlencoded({ extended: true})) // aceitando dados enviados pelo formulário no body(req.body)
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'frontend'))) //dizendo ao express que o caminho dos arquivos estáticos é na pasta public

const sessionOptions = session({
  secret: 'secret cat',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING}),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});
app.use(sessionOptions);

// app.use(helmet())
//helmet comentado pois não é recomendado uso no desenvolvimento local

app.use(flash()) //flash messages

app.set('views', path.resolve(__dirname, 'src', 'views', 'pages')) /* dizendo ao express que o caminho das views
do projeto é sse */

app.set('view engine', 'ejs') /* ejs como view engine do projeto */

app.use(csrf())

app.use(globalMiddleware); //utilizando middlewares em todas as rotas
app.use(checkCsrfError); //utilizando middlewares em todas as rotas
app.use(csrfMiddleware)//utilizando middlewares em todas as rotas

app.use(routes) //utilizando as rotas

app.on('ready', () => { //capturando o sinal enviado pelo app.emit() e iniciando a plicação
  app.listen(8080, () => { //dizendo para o express 'ouvir' na porta 8080
    console.log('Access: http://localhost:8080')
  })  
})