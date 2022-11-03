//import { Db, GridFSBucket, ObjectId } from "mongodb"
const mongo = require('mongodb')
const join = require('path').join
//import { join } from 'path'
// import {
//     existsSync,
//     mkdirSync,
//     writeFileSync,
//     createReadStream,
//     unlinkSync,
//     createWriteStream
// } from 'fs'
const fs = require('fs')

 const ErroUpload = {
    OBJETO_ARQUIVO_INVALIDO : 'Objeto de arquivo inválido',
    NAO_FOI_POSSIVEL_GRAVAR : 'Não foi possível gravar o arquivo no banco de dados'
}

 const ErroDownload = {
    ID_INVALIDO : 'ID inválido',
    NENHUM_ARQUIVO_ENCONTRADO : 'Nenhum arquivo encontrado com este id',
    NAO_FOI_POSSIVEL_GRAVAR : 'Não foi possível gravar o arquivo recuperado'
}

 class ArquivoController {

  
    
    constructor(Db) {
        this.Db = Db
        this._caminhoDiretorioArquivos = join(__dirname, '..', '..', 'arquivos_temporarios')
        if (!fs.existsSync(this._caminhoDiretorioArquivos)) {
            fs.mkdirSync(this._caminhoDiretorioArquivos)
        }
    }

     _ehUmObjetoDeArquivoValido (objArquivo) {
        return objArquivo
            && 'name' in objArquivo
            && 'data' in objArquivo
            && objArquivo['name']
            && objArquivo['data']
    }

     _inicializarBucket() {
        return new mongo.GridFSBucket(this.Db, {
            bucketName: 'arquivos'
        })
    }

    realizarUpload(objArquivo) {
        return new Promise((resolve, reject) => {
            if (this._ehUmObjetoDeArquivoValido(objArquivo)) {
                const bucket = this._inicializarBucket()

                const nomeArquivo = objArquivo['name']
                const conteudoArquivo = objArquivo['data']
                const nomeArquivoTemp = `${nomeArquivo}_${(new Date().getTime())}`

                const caminhoArquivoTemp = join(this._caminhoDiretorioArquivos, nomeArquivoTemp)
                fs.writeFileSync(caminhoArquivoTemp, conteudoArquivo)

                //cria obj de que vai ser enviado ao banco
                const streamGridFS = bucket.openUploadStream(nomeArquivo, {
                    // meta dados personalizados para salvar no banco
                    metadata: {
                        mimetype: objArquivo['mimetype'],
                        dia: 'hoje'
                        //id aluno
                        //id do trabalho
                        
                    }
                })
                //TO DO : ID DO ARQUIVO TEM Q SER SALVO NO PROJETO NO BD
                const streamLeitura = fs.createReadStream(caminhoArquivoTemp)
                console.log(streamLeitura);
                
                streamLeitura
                    .pipe(streamGridFS)
                    .on('finish', () => {
                        fs.unlinkSync(caminhoArquivoTemp)
                        resolve(new mongo.ObjectId(`${streamGridFS.id}`))
                    })
                    .on('error', erro => {
                        console.log(erro)
                        reject(ErroUpload.NAO_FOI_POSSIVEL_GRAVAR)
                    })
            } else {
                reject(ErroUpload.OBJETO_ARQUIVO_INVALIDO)
            }
        })
    }

     realizarDownload(id) {
        return new Promise(async (resolve, reject) => {
            if (id && id.length == 24) {
                const _id = new mongo.ObjectId(id)
                const bucket = this._inicializarBucket()
                const resultados = await bucket.find({ '_id': _id }).toArray()
                console.log(resultados)
                if (resultados.length > 0) {
                    const metadados = resultados[0]
                    const streamGridFS = bucket.openDownloadStream(_id)
                    const caminhoArquivo = join(this._caminhoDiretorioArquivos, metadados['filename'])
                    const streamGravacao = fs.createWriteStream(caminhoArquivo)
                    streamGridFS
                        .pipe(streamGravacao)
                        .on('finish', () => {
                            resolve(caminhoArquivo)
                        })
                        .on('erro', erro => {
                            console.log(erro)
                            reject(ErroDownload.NAO_FOI_POSSIVEL_GRAVAR)
                        })
                } else {
                    reject(ErroDownload.NENHUM_ARQUIVO_ENCONTRADO)
                }

            } else {
                reject(ErroDownload.ID_INVALIDO)
            }
        })
    }
}

    module.exports = {ArquivoController, ErroUpload, ErroDownload}