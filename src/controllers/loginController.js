const Login = require('../models/LoginModel') //importando o model

exports.index = (req, res) => {
  if (req.session.user) res.render('loggedIn')
  res.render('login')
}

exports.register = async function(req, res) { // funcção async pois envolve banco de dados
  try {
    const login = new Login(req.body) //instanciando login
    // passando body(dados enviado do formulário) como parâmetro
    await login.register()
  
    if(login.errors.length > 0) { //validação se há algum erro nas validações do banco de dados
      req.flash('errors', login.errors) // colocando a mensagem de erro no middleware errors
      req.session.save(function() { //salvando a sessão do usuário e redirecionando de volta a tela de login
        return res.redirect('back')
      })
      return;
    }
  
    req.flash('success', 'Seu usuário foi criado com sucesso')// colocando a mensagem de erro no middleware success
    req.session.save(function() { //salvando a sessão do usuário e redirecionando de volta a tela de login
    return res.redirect('back')
    })
  }catch(e) { //renderizando error view caso tenha algum erro na aplciação
    console.log(e)
    return res.render('error')
  }
}

exports.signIn = async function(req, res) { // funcção async pois envolve banco de dados
  try {
    const login = new Login(req.body) //instanciando login
    // passando body(dados enviado do formulário) como parâmetro
    await login.signIn()
  
    if(login.errors.length > 0) { //validação se há algum erro nas validações do banco de dados
      req.flash('errors', login.errors) // colocando a mensagem de erro no middleware errors
      req.session.save(function() { //salvando a sessão do usuário e redirecionando de volta a tela de login
        return res.redirect('back')
      })
      return;
    }
  
    req.flash('success', 'Você logou no sistema')// colocando a mensagem de erro no middleware success
    req.session.user = login.user
    req.session.save(function() { //salvando a sessão do usuário e redirecionando de volta a tela de login
    return res.redirect('back')
    })
  }catch(e) { //renderizando error view caso tenha algum erro na aplciação
    console.log(e)
    return res.render('error')
  }
}

exports.logOut = function(req, res) {
  req.session.destroy();
  res.redirect('/')
}