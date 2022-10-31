const express = require('express')
const app = express.Router();
const controller = require('../controllers/usuario-controller');
const jwt = require('jsonwebtoken')

app.get('/', controller.get);
app.post('/', controller.post);
app.post('/auth/login', controller.login);
app.put('/:id', checkToken, controller.put);
app.delete('/:id', checkToken, controller.delete);

function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ msg: "Acesso negado!" });
    try {
        const secret = process.env.KEY_SECRET;
        jwt.verify(token, secret);
        next();
    } catch (err) {
        res.status(400).json({ msg: "O Token é inválido!" });
    }
}
module.exports = app