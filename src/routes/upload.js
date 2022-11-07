//import { Router } from 'express'
const Router = require("express").Router();
//import * as path from 'path'
const path = require("path");
//import * as fs from 'fs'
const fs = require("fs");
const ObjectId = require("mongodb").ObjectId;
//import { ArquivoController, ErroUpload } from '../controllers/ArquivoController'
const ArquivoController =
  require("../controllers/ArquivoController").ArquivoController;
const ErroUpload = require("../controllers/ArquivoController").ErroUpload;

//import { Console } from 'console'

Router.post("/", async (req, res) => {
  if (!req.files || Object.keys(req.files).length == 0) {
    return res.status(400).send("Nenhum arquivo recebido");
  }

  const nomesArquivos = Object.keys(req.files);
  const diretorio = path.join(__dirname, "..", "..", "arquivos");
  if (!fs.existsSync(diretorio)) {
    fs.mkdirSync(diretorio);
  }

  const bd = req.app.locals.bd;
  const arquivoCtrl = new ArquivoController(bd);

  const idsArquivosSalvos = [];
  let quantidadeErroGravacao = 0;
  let quantidadeErroArquivoInvalido = 0;
  let quantidadeErroInesperado = 0;

  const promises = nomesArquivos.map(async (arquivo) => {
    const Arquivo = req.files[arquivo];
    let objArquivo = {
      nomeProjeto: req.query.nomeProjeto,
      descricao: req.query.descricao,
      semestre: req.query.semestre,
      idDisciplina: req.query.idDisciplina,
      idUsuario: req.query.idUsuario,
    };

    //Buscar se a disciplina e o usuario existem
    let collection = bd.collection("Disciplinas");
    let findDisciplina = await collection
      .find({ _id: ObjectId(req.query.idDisciplina) })
      .toArray();

    collection = bd.collection("Usuarios");
    let findUsuario = await collection
      .find({ _id: ObjectId(req.query.idUsuario) })
      .toArray();

    if (findDisciplina.length == 1 && findUsuario.length == 1) {
      objArquivo = Object.assign(objArquivo, Arquivo);
      //console.log(objArquivo)
      try {
        const idArquivo = await arquivoCtrl.realizarUpload(objArquivo);
        idsArquivosSalvos.push(idArquivo);
      } catch (erro) {
        switch (erro) {
          case ErroUpload.NAO_FOI_POSSIVEL_GRAVAR:
            quantidadeErroGravacao++;
            break;
          case ErroUpload.OBJETO_ARQUIVO_INVALIDO:
            quantidadeErroArquivoInvalido++;
            break;
          default:
            console.log(erro);
            quantidadeErroInesperado++;
        }
      }
    } else {
      res.json("Disciplina ou usuário não encontrado");
    }
  });

  await Promise.all(promises);

  res.json({
    idsArquivosSalvos,
    quantidadeErroGravacao,
    quantidadeErroInesperado,
    quantidadeErroArquivoInvalido,
  });
});

module.exports = Router;
