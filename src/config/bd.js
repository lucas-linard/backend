const MongoClient = require('mongodb').MongoClient
const app = require('../app')

const URI_BD = 'mongodb://127.0.0.1:27017/storage'

const conectarNoBD = async () => {
    const clienteMongo = new MongoClient(URI_BD, {
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