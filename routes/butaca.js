var express = require('express');
var router = express.Router();
const butaca = require('../models/butaca');
const entrada = require('../models/entrada');
const sector = require('../models/sector');

var router = express.Router();

/* GET users listing. */
router.post('/entrada', async function(req, res, next) {
    const fila = req.body.fila
    const numButaca = req.body.numButaca
    const sector = req.body.sector
    const evento = req.body.evento
    console.log(req.user)
    const but = new butaca()
    
    req.session.infoEntrada = []
    
    for (let i = 0; i < fila.length; i++) {
        const idButaca = await but.findButaca(sector[i],fila[i],numButaca[i])
        const infoEntrada = {
            butaca:idButaca[0]._id.toString(),
            evento:evento[i]
        }
        req.session.infoEntrada.push(infoEntrada)
    }
    console.log(req.session.infoEntrada)

    res.send('respond with a resource');
});

router.get('/seleccion/:Sector/:idEvento', async (req, res, next) => {
//actualizar por parametro de evento
const { Sector, idEvento } = req.params
const sec = new sector()
const idSector = await sec.findByNameSector(Sector)
const but = new butaca()
const ent = new entrada()
const butacas = await but.findButacasSector(idSector)
const entrad = await ent.findByEvent(idEvento)
const ocupadas = entrad.map(item => item.butaca.toString());
    res.render('butacas',{
        butacas,
        ocupadas,
        idEvento
    });
});

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/')
}
module.exports = router;
