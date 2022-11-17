const MongoClient = require('mongodb').MongoClient
const app = require('../app')
require('dotenv').config()

// TODO: guardar a chave em uma variável de ambiente

const conectarNoBD = async () => {
    //passar a url de conexao do banco de dados
    const clienteMongo = new MongoClient(process.env.databaseConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

        try {        
        const conexao = await clienteMongo.connect()
        app.locals.bd = conexao.db()        
        console.log(`App conectado ao bd ${conexao.db().databaseName}`)

        process.on('SIGINT', async () => {
            try {
                await conexao.close()
                console.log('Conexão com o bd fechada')
            } catch (erro) {
                console.log(erro)
            }
        })
    } catch (erro) {
        console.log(erro)
    }
}
module.exports =  conectarNoBD