const Router = require("express").Router();
const nodemailer = require("nodemailer");
require("dotenv").config();
const singUp = Router;

function validaEntrada(body) {
  if (!!body.nome || !!body.email || !!body.senha || !!body.perfil) return true;
  else return false;
}

function validaTipo(body) {
  return body.perfil == "aluno" || body.perfil == "professor" ? true : false;
}

function validaEmail(body) {
  let domain = body.email.substring(body.email.lastIndexOf("@") + 1);
  return domain == "ftc.edu.br" ? true : false;
}

function validaTudo(body) {
  return validaEntrada(body) && validaTipo(body) && validaEmail(body)
    ? true
    : false;
}

async function validaProfessor(client,body) {
  const collection = client.collection("Professores");
  const professores = await collection.find({ email: body.email }).toArray();
  return professores.length == 1 ? true : false;
}

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

singUp.post("/", async (req, res) => {
  const client = req.app.locals.bd;

  const collection = client.collection("Usuarios");
  // verifica se o email já existe
  const dados = await collection.find({ email: req.body.email }).toArray();
  
  if (req.body.perfil == "professor") {
    const professor = await validaProfessor(client, req.body);
    if (!professor) {
      res.status(400).send({ message: "Professor não cadastrado" });
      return;
    }
  }
  // se não existir, cria o usuário
  if (validaTudo(req.body) && dados.length == 0) {  
    const user = {
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha,
      perfil: req.body.perfil,
      verificado: false,
    };
     try {
    const insertResult = await collection.insertOne(user);
    const mailSent = await transporter.sendMail({
      text: `Para sua segurança, e autenticar que é você quem está acessando o sistema, por favor, utilize o link abaixo para confirmar sua conta ${
        process.env.hostfront
      }verify?token=${insertResult.ops[0]._id.toString()}`,
      subject: "verificação de email",
      from: `BSI DRIVE <${process.env.Emailuser}>`,
      to: req.body.email,
    });

    res.status(201).send(mailSent);
     } catch (error) {
      console.log(error);
      res.status(400).send(error);
    } 
  } else if (!validaTudo(req.body)) {
    res.status(401).send("dados invalidos");
  } else if (dados.length > 0) {
    res.status(406).send("email ja cadastrado");
  } else {
    res.status(400).send("erro");
  }
});

module.exports = singUp;
