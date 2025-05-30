var express = require('express');
var QRCode = require('qrcode')
var router = express.Router();
const butaca = require('../models/butaca');
const paypal = require('paypal-rest-sdk');
const { PayPalKeys, nodemailerKey } = require("../keys");
const entrada = require('../models/entrada');
const sector = require("../models/sector");
const eventos = require("../models/eventos");
const estadio = require("../models/estadio");
const nodemailer = require("nodemailer")

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
        let eventoId = new eventos()
        eventoId = await eventoId.findByID(evento[i])
        console.log(eventoId)
        let precioEntrada = eventoId.precio
        //Busco el id de la butaca y hago una variable para luego posteriormente hacer un qr
        const idButaca = await but.findButaca(sectores[i], fila[i], numButaca[i])

        const qrString = idButaca[0]._id.toString() + sectores[i] + fila[i] + idUsuario + evento[i]

        const codigoQR = await QRCode.toDataURL(qrString)

        let sect = new sector()
        sect = await sect.findByZonaSector(sectores[i])


        precioEntrada = precioEntrada * sect.multiplicador
        precioTotal += precioEntrada
        const entradas = new entrada({
            cod_qr: codigoQR,
            precio: precioEntrada,
            usuario: idUsuario,
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
            for (let i = 0; i < payment.links.length; i++) {
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


    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            const entradas = req.session.entradas
            let arrayEntrada = []
            let idEntrada = ""
            let eventoTituloEmail = ""
            //Consulto en la bd para sacar la info de la entrada
            for (const item of entradas) {
                const confirmarEntrada = new entrada(item);
                let entrada2 = await confirmarEntrada.addEntrada();

                idEntrada += `${entrada2._id.toString()}-`


                let eventoId = new eventos();
                eventoId = await eventoId.findByID(item.evento);

                let butacaId = new butaca();
                butacaId = await butacaId.findByID(item.butaca);

                let sectorId = new sector();
                sectorId = await sectorId.findByZonaSector(butacaId.sector.toString());

                let estadioId = new estadio();
                estadioId = await estadioId.findByIDEstadio(sectorId.estadio.toString());

                //Creo el objeto guardandolo en el array recien declarado arriba
                arrayEntrada.push({
                    cod_qr: item.cod_qr,
                    precio: item.precio,
                    nombre_evento: eventoId.titulo,
                    eventoImg: eventoId.imagen,
                    butacaFila: butacaId.fila,
                    butacaNum: butacaId.num_butaca,
                    numSector: sectorId.num_sector,
                    zonaSector: sectorId.zona,
                    estadio: estadioId.nombre,
                    fecha: eventoId.fecha
                });
                eventoTituloEmail = eventoId.titulo
            }
            //Si todo esta correcto se le manda al usuario un email de confirmación 
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'cesar33jverne@gmail.com',
                    pass: `${nodemailerKey.key}`
                }
            });

            // Wrap in an async IIFE so we can use await.
            (async () => {
                const info = await transporter.sendMail({
                    from: 'cesar33jverne@gmail.com',
                    to: req.user.correo,
                    subject: "Entradas evento " + eventoTituloEmail,
                    text: "Entradas evento " + eventoTituloEmail, // plain‑text body
                    html: `
    <div style="background:#f7f7f7;padding:30px 0;">
        <div style="max-width:420px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 2px 8px #0001;padding:32px 24px;text-align:center;">
            <h2 style="color:#ff6700;margin-bottom:12px;">¡Compra realizada con éxito!</h2>
            <p style="color:#333;font-size:16px;margin-bottom:18px;">
                Gracias por comprar las entradas para este evento.<br>
                Las podrás encontrar en tu perfil, en la sección <b>Mis entradas</b>.
            </p>
            <a href="http://localhost:3000/users/misEntradas" style="display:inline-block;margin-top:10px;padding:10px 24px;background:#ff6700;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
                Ir a Mis Entradas
            </a>
        </div>
    </div>
`
                });

                console.log("Message sent:", info.messageId);
            })();
            req.session.precioTotal = 0
            console.log("arrayEntradas", arrayEntrada)
            console.log("idEntradas", idEntrada)
            res.render("entradasCompradas", { arrayEntrada, idEntrada })
        }
    });

});

router.get('/cancel', (req, res) => res.send("Pago cancelado <a href='/'>Volver a inicio</a>"));

module.exports = router;