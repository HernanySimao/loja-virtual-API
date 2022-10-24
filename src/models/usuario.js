const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
    nome: { type: String, required: true },
    senha: { type: String, required: true },
    email: { type: String, required: true },
    numero: { type: Number, required: true },

})


module.exports = mongoose.model('usuario', schema);