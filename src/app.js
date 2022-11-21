const express = require('express')
const  fileUpload = require('express-fileupload')
const cors = require('cors')
const logger = require('morgan')

//import das routes
const uploadRouter = require('./routes/upload')
const signgUp = require('./routes/signUp')
const login = require('./routes/login')
const professores = require('./routes/professores')
const disciplina = require('./routes/disciplina')
const projeto = require('./routes/projeto')
const download = require('./routes/download')
const mail = require('./routes/mail')

const app = express()
app.use(express.json())
app.use(cors())
app.options('*', cors());
app.use(logger('dev'))
app.use(fileUpload())



app.use('/upload', uploadRouter)
app.use('/signUp', signgUp)
app.use('/login', login)
app.use('/professores', professores)
app.use('/disciplina', disciplina)
app.use('/projeto', projeto)
app.use('/download', download)
app.use('/mail', mail)


module.exports = app