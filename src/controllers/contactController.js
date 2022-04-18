const { response } = require('express');
const { redirect } = require('express/lib/response');
const Contact = require('../models/ContactModel')

exports.index = (req, res) => {
  res.render('contact', {
    contact: {}
  })
}

exports.register = async function(req, res) {
  try{
    const contact = new Contact(req.body);
    await contact.register();
    
    if(contact.errors.length > 0) {
      req.flash('errors', contact.errors)
      req.session.save(() => res.redirect('back'));
      return;
    }
  
    req.flash('success', 'Contato registrado com sucesso')
    req.session.save(() => res.redirect(`/contact/index/${contact.contact._id}`));
    return;
  }catch(e){
    console.log(e)
    return res.render('error')
  }
}

exports.editIndex = async function(req, res) {
  try{
    if(!req.params.id) return res.render('error');

    const contact = await Contact.idSearch(req.params.id);
    if(!contact) return res.render('error')

    res.render('contact', { contact });

  }catch(e){
    console.log(e)
    return res.render('error')
  }
}

exports.edit = async function(req, res) {
  try{
    if(!req.params.id) return redirect.render('error')
    const contact = new Contact(req.body);
    await contact.edit(req.params.id);

    if(contact.errors.length > 0) {
      req.flash('errors', contact.errors)
      req.session.save(() => res.redirect('back'));
      return;
    }
  
    req.flash('success', 'Contato alterado com sucesso')
    req.session.save(() => res.redirect(`/contact/index/${contact.contact._id}`));
    return;
  }catch(e){
    console.log(e)
    return res.render('error')
  }
}

exports.delete = async(req, res) => {
  try{
    if(!req.params.id) return res.render('error');

    const contact = await Contact.delete(req.params.id);
    if(!contact) return res.render('error')

    req.flash('success', 'Contato excluido com sucesso')
    req.session.save(() => res.redirect('back'));
    return;

  }catch(e){
    console.log(e)
    return res.render('error')
  }
}