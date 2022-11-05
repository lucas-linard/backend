const Router = require("express").Router();
const MongoClient = require("mongodb").MongoClient;
const singUp = Router

function validaEntrada(query) {
    if (
      !!query.nome ||
      !!query.email ||
      !!query.senha ||
      !!query.perfil
    )
      return true;
    else return false;
  }

  function validaTipo(query) {
    return query.perfil == "aluno" || query.perfil == "professor" ? true : false;
  }

  function validaEmail(query) {
    let domain = (query.email. substring(query.email. lastIndexOf('@') +1))
    return domain == "ftc.edu.br" ? true : false;
  }

  function validaTudo(query) {
    return validaEntrada(query) && validaTipo(query) && validaEmail(query) ? true : false;
  }
 
singUp.post("/", async (req, res) => {

    
    const client = req.app.locals.bd
  

    const collection = client.collection('Usuarios');
  
    const dados = await collection.find({email: req.query.email}).toArray()

            
    if( validaTudo(req.query) && dados.length == 0){
      try {
        const insertResult = await collection.insertOne(req.query);
        res.json({ message: 'OK' });
      } catch (error) {
        res.json({ message: error });
      }
    } else {
      res.json({ message: "Entrada inválida" });
    }
});

module.exports = singUp;