var express = require('express');
var router = express.Router();
const butaca = require('../models/butaca');
const entrada = require('../models/entrada');
const sector = require('../models/sector');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/seleccion/:Sector/:idEvento',isAuthenticated, async (req, res, next) => {
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
