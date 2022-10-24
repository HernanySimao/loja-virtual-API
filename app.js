const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()

app.use(bodyParser.json());
app.use(express.json());

mongoose.connect(process.env.DB).then((req, res) => {
    console.log("Mongo Rodando");
}).catch((err) => {
    res.status(401).send({
        msg: "your problem here" + err
    })
})

const products = require('./src/models/product');
const usuario = require('./src/models/usuario')


const userRouter = require("./src/router/usuario-router");
const productsRouter = require("./src/router/products-router");



app.use('/products', productsRouter);
app.use('/user', userRouter);



app.listen(8080, (req, res) => {
    console.log("Servidor rodando");
})