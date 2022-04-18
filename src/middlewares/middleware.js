exports.globalMiddleware = (req, res, next) => {
  res.locals.errors = req.flash('errors'); //criando middleware flash error 
  res.locals.success = req.flash('success'); //criando middleware flash success
  res.locals.user = req.session.user;
  next()
}

exports.csrfMiddleware = (req, res, next) => {
  //enviado o csrftoken por meio dos middlewares
  res.locals.csrfToken = req.csrfToken()
  next()
}

exports.checkCsrfError = (err, req, res, next) => {
  //se houver qualquer erro na aplicação, o usuário será redirecionado para a página error
  if(err) {
    return res.render('error')
  }
  next()
}
