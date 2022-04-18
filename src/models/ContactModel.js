const mongoose = require('mongoose');
const validator = require('validator')

const ContactSchema = new mongoose.Schema({
  name: {type: String, required: true},
  surname: {type: String, required: false, default: ''},
  email: {type: String, required: false, default: ''},
  phone: {type: String, required: false, default: ''},
  createdAt: {type: Date, default: Date.now},
});

const ContactModel = mongoose.model('Contact', ContactSchema)

function Contact(body) {
  this.body = body;
  this.errors = []
  this.contact = null
};

Contact.prototype.register = async function() {
  this.validate();
  if(this.errors.length > 0) return;

  this.contact = await ContactModel.create(this.body)
};

Contact.prototype.validate = function() {
  this.cleanUp();

  if(!this.body.name || this.body.name.length <= 2) this.errors.push('Nome é um campo obrigatório e deve conter mais de duas letras')

  //validação do email
  if(this.body.email && !validator.isEmail(this.body.email)) { //pacote validator verificando se o email é realmente um email
    this.errors.push("E-mail inválido!")
  }

  if(!this.body.email && !this.body.phone) {
    this.errors.push("É necessário cadastrar pelo menos um nome ou um email")
  }

};

  /* a função cleanUp() verifica se apenas strings estão nos campos
  e tira o csrftoken do body*/
Contact.prototype.cleanUp = function() { 
  for(const key in this.body) {
    if (typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {
    name: this.body.name,
    surname: this.body.surname,
    email: this.body.email,
    phone: this.body.phone,
  }
};

Contact.prototype.edit = async function(id) {
  if(typeof id !== 'string') return;
  this.validate();

  if(this.errors.length > 0) return;

  this.contact = await ContactModel.findByIdAndUpdate(id, this.body, { new: true });
};

//static
Contact.idSearch = async function(id) {
  if(typeof id !== 'string') return;
  const user = await ContactModel.findById(id);
  return user;
};

Contact.contactSearch = async function() {
  const contacts = await ContactModel.find()
    .sort({ createdAt: -1 });
  return contacts;
};

Contact.delete = async function(id) {
  if(typeof id !== 'string') return;
  const contact = await ContactModel.findByIdAndDelete(id)
  return contact;
};



module.exports = Contact