var express = require('express');

var router = express.Router();
const entrada = require('../models/entrada');
const sector = require("../models/sector");
const eventos = require("../models/eventos");
const estadio = require("../models/estadio");
const butaca = require("../models/butaca");
const ejs = require("ejs");
const path = require("path");
const pdf = require("pdf-creator-node");
const fs = require("fs");


router.get("/",async function(req,res,next){
    let evento = new eventos()
    evento = await evento.eventosDisponibles()
    res.render("todosEventos",{evento})
})

router.get("/evento/:id",async function(req,res,next){
    let id = req.params.id
    console.log(id)
    let evento = new eventos()
    evento = await evento.findByID(id)
    console.log(evento)
    res.render("evento",{evento})
})
router.get("/:genero",async function(req,res,next){
    let genero = req.params.genero
    let evento = new eventos()
    evento = await evento.findGenero(genero)
    res.render("eventoGenero",{evento})
})
/* GET users listing. */
router.post('/busqueda', async function (req, res, next) {
    const { nombre } = req.body
    let evento = new eventos()
    evento = await evento.buscadorHeader(nombre)
    res.render("eventoBusqueda", { evento, nombre })
});

router.get("/pdf/:ids",isAuthenticated,async function (req, res, nex) {
    //recojo los ids por parametros y los separo
    let ids = req.params.ids
    let id = ids.split("-")
    //filtro los ids para que no contengan espacios en blaco
    const idsEntrada = id.filter(id => id !== "");

    let arrayEntrada = []

    //Saco toda la informacion necesaria para utilizar en el template
    for (const item of idsEntrada) {
        let entradas = new entrada()
        let entradaEvento = await entradas.findById(item)

        let eventoId = new eventos();
        eventoId = await eventoId.findByID(entradaEvento.evento.toString());
        
        let butacaId = new butaca();
        butacaId = await butacaId.findByID(entradaEvento.butaca.toString())  
        let sectorId = new sector();
        sectorId = await sectorId.findByZonaSector(butacaId.sector.toString())   
        let estadioId = new estadio();
        estadioId = await estadioId.findByIDEstadio(sectorId.estadio.toString());


        let fecha=new Date(eventoId.fecha)

        const meses=["Ene", "Feb" , "Mar" , "Abr" , "May" , "Jun" , "Jul" , "Ago" , "Sep" , "Oct"
        , "Nov" , "Dic" ] 
        let mes=fecha.getMonth()
        let dia=fecha.getDate() 
        let año=fecha.getFullYear() 
        let hora=fecha.getHours() 
        let min=String(fecha.getMinutes()).padStart(2, "0" ); 
        arrayEntrada.push({
                    cod_qr: entradaEvento.cod_qr,
                    nombre_evento: eventoId.titulo,
                    eventoImg: eventoId.imagen,
                    butacaFila: butacaId.fila,
                    butacaNum: butacaId.num_butaca,
                    numSector: sectorId.num_sector,
                    zonaSector: sectorId.zona,
                    estadio: estadioId.nombre,
                    fecha: ` ${dia} ${meses[mes]} ${año} ${hora}:${min}`
                })
    }

    try{
        //los datos a mandar al ejs:
        const data = {
            arrayEntrada
        }
        //Se manda a ese fichero a descargarEntradas y 
    const html = await ejs.renderFile(path.join(__dirname, "../views/descargarEntradas.ejs"), data, {async: true});

    //El documento, sera un htmlk y tendra ese nombre.
    const document = {
        html: html,
        data: {},
        path: "./entradas.pdf",
        type: "",
    };

    //Aqui ponemos las opciones del documento
    //en mi caso lo dejo estandard
    const options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
    };

    //Creo el pdf y hago la respuesta sea descarga.
    await pdf.create(document, options);

    res.download("./entradas.pdf");

    }catch (error) {
        console.error("Error generando PDF:", error);
        res.status(500).send("Error al generar el PDF");
    }
    

})
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/')
}
module.exports = router;
