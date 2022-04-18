const mongoose = require('mongoose');
const validator = require('validator')
const bcryptjs = require('bcryptjs');

const loginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: false }
});

const loginModel = mongoose.model('login', loginSchema)

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async register() {
    this.validate();
    if(this.errors.length > 0) return;

    await this.userExists();

    if(this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt)

    try {
      this.user = await loginModel.create(this.body)
    }catch(e) {
      console.log(e)
    }
  }

  async userExists() {
    const user = await loginModel.findOne({email: this.body.email})
    if (user) {
      this.errors.push('Usuário ja existe')
    }
  }

  validate() {
    this.cleanUp();

    //validação do email
    if(!validator.isEmail(this.body.email)) {
      this.errors.push("E-mail inválido!")
    }

    //validação da senha entre 3 e 20 caracteres
    if(this.body.password.length < 3 || this.body.password.length > 20) {
      this.errors.push("A senha precisa ter entre 3 e 20 caracteres.")
    }
  }

  cleanUp() {
    for(const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password
    }
  }
}

module.exports = Login