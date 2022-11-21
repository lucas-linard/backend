const Router = require('express').Router();
const objectId = require('mongodb').ObjectId
const professores = Router

professores.get('/', async (req, res) => {
//
const client = req.app.locals.bd
let collection = client.collection('Usuarios');
try {
    let dados = await collection.find({_id: new objectId(req.query.id)}).toArray()    
    if(dados.length == 1){
        collection = client.collection('Professores')
        dados = await collection.find({}).toArray()
        const prof = dados.map((p) =>{ return {id: p._id.toString(), nome: p.nome, email: p.email}}) 
            res.status(200).send(prof)    
        } else 
        res.status(400).send({message: 'id invalida'})           
} catch (error) {
    res.status(400).send({message: 'id invalida'})
}


})

module.exports = professores;