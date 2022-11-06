const Router = require("express").Router();
const ObjectId = require("mongodb").ObjectId;
const disciplina = Router;

disciplina.post("/", async (req, res) => {
  async function validate(query) {
    if (
      !!query.nome &&
      !!query.codDisciplina &&
      !!query.idProfessor &&
      !!query.descricao &&
      !!query.semestre &&
      !!query.cargahoraria
    ) {
      const findProfessor = await collection
        .find(ObjectId(query.idProfessor))
        .toArray();
      return findProfessor.length == 1 && findProfessor[0].perfil == "professor"
        ? true
        : false;
    } else return false;
  }

  const client = req.app.locals.bd;
  let collection = client.collection("Usuarios");
  let isValid = await validate(req.query);
  if (isValid) {
    try {
      const insertOne = await client
        .collection("Disciplinas")
        .insertOne(req.query);
      res.json("OK");
    } catch (error) {
      res.json(error);
    }
  } else {
    res.json("Entrada inválida");
  }
});
module.exports = disciplina;
