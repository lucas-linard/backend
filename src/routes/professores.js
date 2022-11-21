const Router = require('express').Router();
const objectId = require('mongodb').ObjectId
const professores = Router

professores.get('/', async (req, res) => {

const client = req.app.locals.bd
const collection = client.collection('Usuarios');
console.log(req.query.id)
try {
    let dados = await collection.find({_id: new objectId(req.query.id)}).toArray()
    console.log(dados)
    if(dados.length == 1){
        dados = await collection.find({perfil: 'professor'}).toArray()
        const prof = dados.map((p) =>{ return {id: p._id.toString(), nome: p.nome, email: p.email}}) 
            res.status(200).send(prof)    
        } else 
        res.status(400).send({message: 'id invalida'})           
} catch (error) {
    res.status(400).send({message: 'id invalida'})
}


})

module.exports = professores;