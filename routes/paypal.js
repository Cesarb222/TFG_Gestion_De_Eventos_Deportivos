var express = require('express');
var router = express.Router();
const butaca = require('../models/butaca');
const paypal = require('paypal-rest-sdk');
const {PayPalKeys} = require("../keys");
const entrada = require('../models/entrada');
const sector = require("../models/sector");

paypal.configure({
    'mode': 'sandbox', // Modo sandbox para pruebas
    'client_id': `${PayPalKeys.CLIENT_ID}`,
    'client_secret': `${PayPalKeys.CLIENT_SECRET}`
});

router.post('/pay', async (req, res) => {
    const fila = req.body.fila
    const numButaca = req.body.numButaca
    const sectores = req.body.sector
    const evento = req.body.evento

    const user = req.user
    let idUsuario = ""
    if (user) {
        idUsuario = user._id.toString();
    } 
    const but = new butaca()
    req.session.entradas = []

    
    let precioTotal = 0;
    
    for (let i = 0; i < fila.length; i++) {
        let precioEntrada = 20
        //Busco el id de la butaca y hago una variable para luego posteriormente hacer un qr
        const idButaca = await but.findButaca(sectores[i],fila[i],numButaca[i])
        
        const qrString =idButaca[0]._id.toString()+sectores[i]+fila[i]+idUsuario+evento[i]

        let multiplicador = 1;

        let sect = new sector()
        sect = await sect.findByZonaSector(sectores[i])
        if(sect.zona == "fondo"){
            multiplicador = 1.5
        }
        if(sect.zona == "tribuna"){
            multiplicador = 2
        }

        precioEntrada = precioEntrada*multiplicador
        precioTotal += precioEntrada
        const entradas = new entrada({
            cod_qr: qrString,
            precio:precioEntrada,
            usuario:idUsuario,
            evento: evento[i],
            butaca: idButaca[0]._id.toString()
        })

        req.session.entradas.push(entradas)
        
    }
    req.session.precioTotal = precioTotal
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/paypal/success",
            "cancel_url": "http://localhost:3000/paypal/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Entradas",
                    "sku": "001",
                    "price": `${precioTotal}`,
                    "currency": "EUR",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "EUR",
                "total": `${precioTotal}`
            },
            "description": "Pago por un artículo de prueba."
        }]
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
            throw error;
        } else {
            for(let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
});

router.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "EUR",
                "total": req.session.precioTotal
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            const entradas = req.session.entradas
            entradas.forEach(async item => {
                const confirmarEntrada = new entrada(item); // reconstruimos como instancia de Mongoose
                await confirmarEntrada.addEntrada()
            });
            
            res.render("entradasCompradas",{entradas})
        }
    });

    req.session.precioTotal = 0
});

router.get('/cancel', (req, res) => res.send('Pago cancelado'));

module.exports = router;