import { Router } from "express";
import { MongoClient } from 'mongodb'
import { app } from '../app'

export const newUser = Router();
function validaEntrada(query: any) {
    if (
      !!query.nome ||
      !!query.email ||
      !!query.senha ||
      !!query.tipo
    )
      return true;
    else return false;
  }

  function validaTipo(query: any) {
    return query.tipo == "aluno" || query.tipo == "professor" ? true : false;
  }

  function validaEmail(query: any) {
    return String(query.email).toLowerCase().includes("@ftc.edu.br") ? true : false;
  }

  function validaTudo(query: any) {
    return validaEntrada(query) && validaTipo(query) && validaEmail(query) ? true : false;
  }
 
//TODO: VERIFICAR ANTES NO BANCO SE JA EXISTE O USUARIO
// FAZER CONDICIONAL DE RESPOSTA
// FAZER CONDICIONAL DE ERRO
newUser.post("/", async (req, res) => {
    const URI_BD = 'mongodb://localhost:27017/storage'
    const cliente = new MongoClient(URI_BD, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    const conexao = await cliente.connect()
    app.locals.bd = conexao.db()
    const db = cliente.db('storage');
    const collection = db.collection('Usuarios');

    if(validaTudo(req.query)){
      try {
        const insertResult = await collection.insertOne(req.query);
        res.json({ message: insertResult });
      } catch (error) {
        res.json({ message: error });
      }  
    } 
});

// { id
//     NOMEM
//     email
//     senha
//     tipo : prof ou aluno
// }

