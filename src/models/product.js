const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    slog: { type: String, required: true, unique: true },
    preco: { type: Number, required: true, default: 0 },
    tags: { type: String, required: true },
    createDate: { type: Date, default: Date.now },
    status: { type: Boolean, default: true }
})

module.exports = mongoose.model('produtos', schema);