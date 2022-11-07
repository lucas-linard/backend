const Router = require('express').Router();
const projeto = Router

projeto.post('/', async (req, res) => {

const client = req.app.locals.bd
const collection = client.collection('Usuarios');

function validate(query) {
    if (!!query.nome &&
        !!query.descricao &&
        !!query.semestre &&
        !!query.idDisciplina
        ) {
        return true
    }
}

if(validate(req.query))
res.json('OK')
})
module.exports = projeto;