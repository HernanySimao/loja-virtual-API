const mongoose = require('mongoose');
const User = mongoose.model('usuario');
const md5 = require('md5');
const jwt = require('jsonwebtoken');


exports.get = (req, res) => {
    User.find({ active: true }, '-_id nome email numero').then((data) => {
        res.status(200).send(data)
    }).catch((e) => {
        res.status(401).send({
            msg: e
        })
    })
}

exports.post = async (req, res) => {
    const { nome, senha, email, numero } = req.body

    if (!nome) res.status(404).send({ msg: "O nome é obrigatorio" })
    if (!senha) res.status(404).send({ msg: "A senha é obrigatoria" })
    if (!email) res.status(404).send({ msg: "O email é obrigatorio" })
    if (!numero) res.status(404).send({ msg: "O numero é obrigatorio" })

    const existName = await User.findOne({ nome: nome })
    if (existName) {
        res.status(422).send({
            msg: nome + " é um nome já cadastrado, tente outro nome!"
        })
    }

    const existEmail = await User.findOne({ email: email })
    if (existEmail) {
        res.status(422).send({
            msg: "Email já está sendo utilizado, tente novamente!"
        })
    }

    const existNumber = await User.findOne({ numero: numero });
    if (existNumber) {
        res.status(422).send({
            msg: "Número já existente, tente novamente por favor"
        })
    }

    if (senha <= 5 || senha == null) {
        res.status(200).send({
            msg: "A sua senha é fraca, tente novamente!"
        })
    }

    const user = new User({
        nome: req.body.nome,
        senha: md5(req.body.senha + process.env.KEY_SECRET),
        email: req.body.email,
        numero: req.body.numero
    });

    try {
        await user.save();
        res.status(200).send({
            msg: nome + " adicionado com sucesso!"
        })
    } catch (error) {
        res.status(500).send({
            msg: error
        });
    }
}

exports.login = async (req, res) => {
    const { email, senha } = req.body

    if (!email) {
        res.status(404).send({
            msg: "O email é obrigatoria"
        })
    }

    if (!senha) {
        res.status(404).send({
            msg: "A senha é obrigatorio"
        })
    }

    const existUser = await User.findOne({ email: email });
    if (!existUser) {
        res.status(422).send({
            msg: "Usúario não encontrado! "
        })
    }

    //TODO falta fazer validacao com a senha para gerar o token!


    const segret = process.env.KEY_SECRET
    try {
        const token = jwt.sign({ id: User._id }, segret);
        res.status(200).send({
            msg: "Autenticacao feita!", token
        })
    } catch (error) {
        res.status(422).send({
            msg: error
        })
    }
}

exports.put = async (req, res) => {
    const { nome, email, numero } = req.body
    if (!nome) res.status(404).send({ msg: "Nome é obrigatorio" })
    if (!email) res.status(404).send({ msg: "Email é obrigatorio" })
    if (!numero) res.status(404).send({ msg: "Número é obrigatorio" })

    const usuario = await User.findByIdAndUpdate(req.body.id, {
        $set: {
            nome: nome,
            email: email,
            numero: numero
        }
    })

    if (!usuario) {
        res.status(422).send({
            msg: "Usuario não encontrado, tente novamente!"
        })
    }

    res.status(200).send({
        msg: "Actualização feita!"
    })
}


exports.delete = async (req, res) => {
    const usuario = await User.findByIdAndDelete(req.params.id);
    if (!usuario) {
        res.status(422).send({
            msg: "Produto não existe, tente novamente!"
        })
    }
    res.status(200).send({
        msg: "Produto eliminado!"
    })
}   