const Router = require("express").Router();
const nodemailer = require("nodemailer");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const mail = Router;

const transporter = nodemailer.createTransport({
  host: process.env.Emailhost,
  port: process.env.Emailport,
  auth: {
    user: process.env.Emailuser,
    pass: process.env.Emailpass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

mail.get("/verificar", async (req, res) => {
  const client = req.app.locals.bd;
  const collection = client.collection("Usuarios");
  try {    
    const update = await collection.updateOne(
      { _id: new ObjectId(req.query.token) },
      { $set: { verificado: true } }
    );
    res.redirect("https://frontend-one-pi.vercel.app/EmailConfirm");
  } catch (error) {
    res.status(400).send(error);
  }
});

mail.post("/resetPassword", async (req, res) => {
  const client = req.app.locals.bd;
  let collection = client.collection("Usuarios");
  try {
    const update = await collection.updateOne(
      { _id: new ObjectId(req.body.token) },
      { $set: { senha: req.body.novaSenha } }
    );
    res.status(200).send(update.result);
  } catch (error) {
    res.status(400).send("aluno nao encontrado/ id invalido");
  }
});

mail.post("/ForgotPassword", async (req, res) => {
  const client = req.app.locals.bd;
  let collection = client.collection("Usuarios");
  try {
    const dados = await collection.find({ email: req.body.email }).toArray();    
     const mailSent = await transporter.sendMail({
       text: `Pedido de alteração de senha, para alterar sua senha, por favor, utilize o link abaixo ${process.env.hostfront}ForgotPassword?token=${dados[0]._id.toString()}`,
       subject: "verificação de email",
       from: `BSI DRIVE <${process.env.Emailuser}>`,
       to: req.body.email,
     });
    res.status(200).send(mailSent)  ;
  } catch (error) {
    res.status(400).send("email nao encontrado ou invalido");
  }
});
module.exports = mail;
