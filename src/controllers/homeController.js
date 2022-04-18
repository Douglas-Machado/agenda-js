exports.index = (req, res) => { //rota  sendo exportada
  res.render('index'); //não é necessário informar a extensão do arquivo pois o view engine ja foi declarado como ejs
  return;
}
