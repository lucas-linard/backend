const Router = require("express").Router();
const projeto = Router;
const ObjectId = require("mongodb").ObjectId;

projeto.get("/:id", async (req, res) => {
  const client = req.app.locals.bd;
  let collection = client.collection("Usuarios");

  if (!!req.params.id) {
    let find = await collection
      .find({ _id: ObjectId(req.params.id) })
      .toArray();

    if (find.length == 1 && find[0].perfil == "aluno") {
      collection = client.collection("Projetos.files");
      find = await collection
        .find({ "metadata.idUsuario": req.params.id })
        .toArray();
      res.status(200).send(find);
    } else if (find.length == 1 && find[0].perfil == "professor") {
      // encontrar todas as materias vinculadas a um professor
      collection = client.collection("Disciplinas");
      find = await collection.find({ idProfessor: req.params.id }).toArray();
      find = find.map((item) => item._id.toString());

      // encontrar todos os projetos vinculados a essas materias
      collection = client.collection("Projetos.files");
      let dados = [];
      for (let i = 0; i < find.length; i++) {
        let query = await collection
          .find({ "metadata.idDisciplina": find[i] })
          .toArray();
        dados.push(query);
      }
      res.status(200).send(dados);
    }
  } else {
    res.status(400).send("Usuário não encontrado");
  }
});
module.exports = projeto;
