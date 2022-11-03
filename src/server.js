//import * as express from 'express'
const app = require('./app')
const conectarNoBD = require('./config/bd')

const porta = process.env.PORT || 3000
//const app = express()
const server = app.listen(
    porta,
    () => {
        conectarNoBD()
        console.log(`App ouvindo na porta ${porta}`)
    }
)

process.on('SIGINT', () => {
    server.close()
    console.log('App finalizado')
})