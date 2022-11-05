const Router = require("express").Router();
const MongoClient = require("mongodb").MongoClient;
const login = Router;

login.get("/", async (req, res) => {
  const client = req.app.locals.bd;
  const collection = client.collection("Usuarios");
  const dados = await collection
    .find({ email: req.query.user, senha: req.query.senha })
    .toArray();

  if (dados.length == 1) {
    res.json({
      message: {
        id: dados[0]._id,
        nome: dados[0].nome,
        email: dados[0].email,
        perfil: dados[0].perfil,
      },
    });
  } else {
    res.json({ message: "Entrada inválida" });
  }
});

module.exports = login;
