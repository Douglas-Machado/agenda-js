const Contact = require('../models/ContactModel')
exports.index = async(req, res) => {
  try{
    const contacts = await Contact.contactSearch()
    res.render('index', { contacts })

  }catch(e){
    console.log(e)
    res.render('error')
  }
}
