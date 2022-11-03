import { Router } from "express";
import { MongoClient , ObjectId} from "mongodb";
import { app } from "../app";



export const novaDisciplina = Router();
function validaEntrada(query: any) {
  if (
    !!query.nome ||
    !!query.idProfessor ||
    !!query.semestre ||
    !!query.cargaHoraria
  )
    return true;
  else return false;
}

//TODO: VERIFICAR ANTES NO BANCO SE JA EXISTE O USUARIO
// FAZER CONDICIONAL DE RESPOSTA
// FAZER CONDICIONAL DE ERRO
novaDisciplina.post("/", async (req, res) => {
  const URI_BD = "mongodb://localhost:27017/storage";
  const cliente = new MongoClient(URI_BD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const conexao = await cliente.connect();
  app.locals.bd = conexao.db();
  const db = cliente.db("storage");
  const collection = db.collection("Usuarios");
  
  try {
  
    // procura o professor dentro do banco de dados
    let professor = await collection.find({"_id" : new ObjectId(req.query.idProfessor?.toString())}).toArray();
    let payload = {
        nome: req.query.nome,
        idProfessor: req.query.idProfessor,
        nomeProfessor: professor.nome,
        semestre: req.query.semestre,
        cargaHoraria: req.query.cargaHoraria,
      };
  } catch (error) {
  console.log(error);    
  }
  
  
  
  let payload = {
    nome: req.query.nome,
    idProfessor: req.query.idProfessor,
    nomeProfessor: req.query.nomeProfessor,
    semestre: req.query.semestre,
    cargaHoraria: req.query.cargaHoraria,
  };

  
    res.json({ message: payload });
  // if(validaEntrada(req.query)){
  //   try {
  //     const insertResult = await collection.insertOne(req.query);
  //     res.json({ message: insertResult });
  //   } catch (error) {
  //     res.json({ message: error });
  //   }
  // }
});

// { id
//     NOMEM
//     email
//     senha
//     tipo : prof ou aluno
// }
