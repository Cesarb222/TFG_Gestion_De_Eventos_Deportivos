var express = require('express');

var router = express.Router();
const events = require('../models/eventos');
const estadio = require("../models/estadio")
const sector = require("../models/sector")


/* GET users listing. */
router.get('/:idEvento', async function(req, res, next) {
    req.session.infoEntrada = []
    console.log("info entradas",req.session.infoEntrada)
    const {idEvento} = req.params


    let evento = new events()
    evento = await evento.findByID(idEvento)

    let estadios = new estadio()
    estadios = await estadios.findByIDEstadio(evento.lugar.toString())

    let sectores = new sector()
    sectores = await sectores.findAll()

    let grada = sectores.find(item=> item.zona == "grada")
    let tribuna = sectores.find(item=> item.zona == "tribuna")
    let fondo = sectores.find(item=> item.zona == "fondo")

    let arrayMultiplicador = [grada.multiplicador,tribuna.multiplicador,fondo.multiplicador]
    console.log(evento.precio)
    res.render("sector",{
        idEvento,
        evento,
        estadios,
        arrayMultiplicador
    });
});

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/')
}
module.exports = router;
