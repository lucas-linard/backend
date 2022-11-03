const express = require('express')
const  fileUpload = require('express-fileupload')
const cors = require('cors')
const logger = require('morgan')

// import { uploadRouter } from './routes/upload'
const uploadRouter = require('./routes/upload')
// import { downloadRouter } from './routes/download'
// import { newUser } from './routes/newUser'
// import { novaDisciplina } from './routes/novaDisciplin
const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(fileUpload())

module.exports = app

 app.use('/upload', uploadRouter)
// app.use('/download', downloadRouter)
// app.use('/newUser', newUser)
// app.use('/novaDisciplina', novaDisciplina)