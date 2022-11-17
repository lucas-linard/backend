const Router = require("express").Router();
const jwt = require("jsonwebtoken");
const login = Router;

login.get("/", async (req, res) => {
  const client = req.app.locals.bd;
  const collection = client.collection("Usuarios");
  const dados = await collection
    .find({ email: req.body.user, senha: req.body.senha })
    .toArray();

  if (dados.length == 1) {
    if (dados[0].verificado) {
      const token = jwt.sign(
        {
          id: dados[0]._id.toString(),
          nome: dados[0].nome,
          email: dados[0].email,
          perfil: dados[0].perfil,
        },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res
        .status(200)
        .send({ message: "Autenticado com sucesso", token: token });
    } else if (!dados[0].verificado) {
      res.status(401).send({ message: "Email não verificado" });
    }
  } else res.status(400).send({ message: "Entrada inválida" });
});

module.exports = login;
