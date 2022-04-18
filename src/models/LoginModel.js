const mongoose = require('mongoose');
const validator = require('validator')
const bcryptjs = require('bcryptjs');

//criando schema abaixo e utilizando mongoose para definir os tipos dos campos
const loginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: false }
});

const loginModel = mongoose.model('login', loginSchema) //model

class Login { //classe Login
  constructor(body) { //recebendo body(usuário criado no formulário da página)
    this.body = body;
    this.errors = []; //setando array de errors
    this.user = null;
  }

  async signIn() {
    this.validateSignIn();

    if (this.errors.length > 0) return;
    this.user = await loginModel.findOne({email: this.body.email})

    if(!this.user) {
      this.errors.push('Usuário ou senha inválidos');
      return;
    } 

    if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida');
      this.user = null
      return;
    }
  }

  /* register() faz as validações, encripta a senha do usuário e coloca no banco de dados */
  async register() {
    this.validateRegister();
    if(this.errors.length > 0) return; //caso haja algum erro no array de erros, a função retorna

    await this.userExists();

    if(this.errors.length > 0) return; //caso haja algum erro no array de erros, a função retorna

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt) //encriptação da senha do usuário

    this.user = await loginModel.create(this.body) //criação do usuário no banco
  }

  /* userExists() verifica se o email enviado no body ja existe */
  async userExists() {
    this.user = await loginModel.findOne({email: this.body.email}) //verificando se já existe esse email no banco
    if (this.user) { //caso exista 'user' então será retornada a mensagem, caso contrário, user será 'null' e poderá ser criado no banco de dados
      this.errors.push('Usuário ja existe')
    }
  }

  /* a função validate faz a validação do email e senha*/
  validateRegister() {
    this.cleanUp();

    //validação do email
    if(!validator.isEmail(this.body.email)) { //pacote validator verificando se o email é realmente um email
      this.errors.push("E-mail inválido!")
    }

    //validação da senha entre 3 e 20 caracteres
    if(this.body.password.length < 3 || this.body.password.length > 20) {
      this.errors.push("A senha precisa ter entre 3 e 20 caracteres.")
    }
  }

  validateSignIn() {
    this.cleanUp();

    //validação do email
    if(!validator.isEmail(this.body.email)) { //pacote validator verificando se o email é realmente um email
      this.errors.push("E-mail inválido!")
    }

    //validação da senha entre 3 e 20 caracteres
    if(this.body.password.length < 3 || this.body.password.length > 20) {
      return this.errors.push("Usuário ou senha inválidos")
    }
  }

  /* a função cleanUp() verifica se apenas strings estão nos campos
  e tira o csrftoken do body*/
  cleanUp() { 
    for(const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = { 
      /* body recebendo apenas email e senha, porque o csrftoken da página também vem no body,
      porém não queremos cadastrar essa chave no banco de dados */
      email: this.body.email,
      password: this.body.password
    }
  }
}

module.exports = Login