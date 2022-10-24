const mongoose = require('mongoose')
const product = mongoose.model('produtos');

exports.get = (req, res) => {
    product.find({
        active: true
    }, 'nome slog preco descricao tags status createDate').then((data) => {
        res.status(200).send(data);
    }).catch((err) => {
        res.status(401).send({
            msg: err
        })
    })
}

exports.getByName = async (req, res) => {
    const { nome } = req.body
    const produto = await product.find({ nome: nome },
        'nome slog preco descricao status');

    if (!produto) {
        res.status(422).send({
            msg: "Produto não encontrado, tente novamente!"
        })
    }
    res.status(200).json(produto)
}



exports.getByid = async (req, res) => {
    const produto = await product.findById(req.params.id, 'nome slog preco descricao status')
    if (!produto) {
        res.status(422).send({
            msg: "Produto não encontrado, tente novamente!"
        })
    }

    res.status(200).send({ produto })
}

exports.post = (req, res) => {
    const { nome } = req.body
    const newslog = nome.toLowerCase().split(" ").join('-')

    const produto = new product({
        nome: req.body.nome,
        descricao: req.body.descricao,
        slog: newslog,
        preco: req.body.preco,
        tags: req.body.tags,
    });
    produto.save().then(() => {
        res.status(200).send({
            msg: "Item foi adicionado com sucesso"
        })
    }).catch((e) => {
        res.status(401).send({
            msg: e
        })
    })
}

exports.put = async (req, res) => {
    const { nome, descricao, slog, preco, tags, status } = req.body

    if (!nome) res.status(404).send({ msg: "Nome é obrigatorio!" })
    if (!descricao) res.status(404).send({ msg: "Descrição é obrigatorio!" })
    if (!tags) res.status(404).send({ msg: "Tags são obrigatorias!" })

    const produto = await product.findByIdAndUpdate(req.params.id, {
        $set: {
            nome: nome,
            descricao: descricao,
            slog: descricao,
            preco: preco,
            tags: tags,
            status: status,
        }
    })

    if (!produto) {
        res.status(422).send({
            msg: "Produto não encontrado, tente novamente!"
        })
    }

    res.status(200).send({
        msg: "Produto actualizado!"
    })
}

exports.delete = async (req, res) => {
    const produto = await product.findByIdAndDelete(req.params.id);
    if (!produto) {
        res.status(422).send({
            msg: "Produto não existe, tente novamente!"
        })
    }
    res.status(200).send({
        msg: "Produto eliminado!"
    })
}