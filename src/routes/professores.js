const Router = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
const professores = Router

professores.get('/', async (req, res) => {

const client = req.app.locals.bd
const collection = client.collection('Usuarios');
const dados = await collection.find({perfil: 'professor'}).toArray()
const prof = dados.map((p) =>{ return {id: p._id, nome: p.nome}}) 

    res.json(prof)

})

module.exports = professores;