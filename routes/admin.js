var express = require('express');
var router = express.Router();
const eventos = require("../models/eventos")
const entradas = require("../models/entrada")
const usuarios = require("../models/usuarios")
const multer = require("multer")
const path = require("path");
const nodemailer = require("nodemailer")
const { nodemailerKey } = require("../keys");

const storage = multer.diskStorage({
    //Aqui pongo el destino de donde va a ir la imagen en mi caso,
    //sera en la carpeta imagenesEventos
    destination: function (req, res, cb) {
        cb(null, path.join(__dirname, "../public/images/imagenesEventos"));
    },
    //Aqui compruebo si tiene la extension que solicito, 
    // si la tiene hago el cb con el nombre de la imagen.
    filename: function (req, file, cb) {
        if (path.extname(file.originalname) == ".jpg"
            || path.extname(file.originalname) == ".jpeg"
            || path.extname(file.originalname) == ".webp"
            || path.extname(file.originalname) == ".png") {
            cb(null, file.fieldname + '-' + file.originalname)
        } else {
            cb(new Error("Formato invalido, se permite: .jpg, .jpeg, .webp, .png"))
        }

    }
})
const upload = multer({ storage })
/* GET users listing. */

router.get('/nuevoEvento', isAuthenticated, function (req, res, next) {
    if (req.user.rol != "admin") {
        res.redirect("/")
    }
    res.render("añadirEvento");
});

router.get("/administrarEventos",isAuthenticated, async function (req, res, next) {
    console.log("aaaa")
    if(req.user.rol != "admin"){
        res.redirect("/")
    }
    let eventosArray = new eventos()
    eventosArray = await eventosArray.findEventosUsuarios(req.user._id)
    let evento = []
    for (const item of eventosArray) {
        let fecha = new Date(item.fecha)
        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct"
            , "Nov", "Dic"]
        let mes = fecha.getMonth()
        let dia = fecha.getDate()
        let año = fecha.getFullYear()
        let hora = fecha.getHours()
        let min = String(fecha.getMinutes()).padStart(2, "0");
        evento.push({
            idEvento: item._id.toString(),
            titulo: item.titulo,
            fecha: ` ${dia} ${meses[mes]} ${año} ${hora}:${min}`,
            estado: item.estado
        })
    }
    res.render("administrarEventos", { evento })
})

router.patch("/administrarEventos/cancelar/:id",isAuthenticated, async function (req, res, next) {
    if(req.user.rol != "admin"){
        res.redirect("/")
    }
    const { id } = req.params
    const estado = req.body

    let event = new eventos()
    event = await event.updateEstado(id, estado.estado)

        let entrada = new entradas()
        entrada = await entrada.findAll()
        let arrayIdUsuarios = []

        for (const item of entrada) {
            if (!arrayIdUsuarios.includes(item.usuario.toString())) {
                arrayIdUsuarios.push(item.usuario.toString())
            }
        }
        
        arrayIdUsuarios.forEach(async item => {
            let usuario = new usuarios()
            usuario = await usuario.findById(item)

            console.log("usuario",usuario)
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
                    to: usuario.correo,
                    subject: "Evento Cancelado" + event.titulo,
                    text: "Evento Cancelado" + event.titulo, // plain‑text body
                    html: `
            <div style="background:#f7f7f7;padding:30px 0;">
                <div style="max-width:420px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 2px 8px #0001;padding:32px 24px;text-align:center;">
                    <h2 style="color:#ff6700;margin-bottom:12px;">Su evento ${event.titulo}, fue cancelado </h2>
                    <p style="color:#333;font-size:16px;margin-bottom:18px;">
                        Lamentamos informarte que tu evento <b>ha sido cancelado</b>.<br>
                        Recibirás el reembolso correspondiente en los próximos días.<br>
                        Lo sentimos por las molestias ocasionadas y agradecemos tu comprensión.
                        Para mas información contacte con el servicio de atencion al cliente
                        <b>atencioncliente@ticketdeporte.com</b>
                    </p>
                    
                </div>
            </div>
        `
                });

                console.log("Message sent:", info.messageId);
            })();
        });

    console.log(event)
    res.json({ event })
})

router.patch("/administrarEventos/actualizar/:id",isAuthenticated, async function (req, res, next) {
    if(req.user.rol != "admin"){
        res.redirect("/")
    }
    const { id } = req.params
    const fecha = req.body

    let event = new eventos()
    const fechaHoy = new Date()
    const fechaEvento = new Date(fecha.fecha)
    let fechaDisponible = await event.compararFechas(fechaEvento)

    if (fechaHoy > fechaEvento) {
        res.status(400).send("La fecha no puede ser anterior a mañana");
    } else if (fechaDisponible) {
        res.status(400).send("Esta fecha no esta disponible");
    } else {
        event = await event.updateFecha(id, fecha.fecha)
        console.log(event)

        let entrada = new entradas()
        entrada = await entrada.findAll()
        let arrayIdUsuarios = []

        for (const item of entrada) {
            if (!arrayIdUsuarios.includes(item.usuario.toString())) {
                arrayIdUsuarios.push(item.usuario.toString())
            }
        }
        
        arrayIdUsuarios.forEach(async item => {
            let usuario = new usuarios()
            usuario = await usuario.findById(item)

            console.log("usuario",usuario)
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
                    to: usuario.correo,
                    subject: "Nueva fecha" + event.titulo,
                    text: "Nueva fecha" + event.titulo, // plain‑text body
                    html: `
            <div style="background:#f7f7f7;padding:30px 0;">
                <div style="max-width:420px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 2px 8px #0001;padding:32px 24px;text-align:center;">
                    <h2 style="color:#ff6700;margin-bottom:12px;">Su evento ${event.titulo}, tiene nueva fecha!! </h2>
                    <p style="color:#333;font-size:16px;margin-bottom:18px;">
                        Tu evento ha sido actualizado con una nueva fecha.<br>
                        Puedes revisar los detalles en tu perfil, en la sección <b>Mis entradas</b>.<br>
                        Gracias por tu confianza.
                    </p>
                    <a href="http://localhost:3000/" style="display:inline-block;margin-top:10px;padding:10px 24px;background:#ff6700;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
                        Ir a Mis Entradas
                    </a>
                </div>
            </div>
        `
                });

                console.log("Message sent:", info.messageId);
            })();
        });

        res.json({ event })
    }

})

router.get("/administrarRoles", function (req, res, next) {
    if(req.user.rol != "admin"){
        res.redirect("/")
    }
    res.render("administrarRol")

})
router.patch("/actualizarRol/:id", isAuthenticated, async function(req,res,nex){
    
    console.log(req.body.idUser)
    let usuario = new usuarios()
    usuario = await usuario.updateRol(req.body.idUser,req.body.rol)

    res.json({usuario})
})

router.get("/verCorreos",isAuthenticated, async function (req,res,next){
    let email = req.query.email
    let usuario = new usuarios()
    usuario = await usuario.buscadorEmail(email)

    res.json({usuario})
})
router.post('/nuevoEvento', isAuthenticated, upload.single('imagen'), async function (req, res, next) {

    const event = new eventos()

    const fechaHoy = new Date()
    const fechaEvento = new Date(req.body.fecha)
    let fechaDisponible = await event.compararFechas(fechaEvento)
    if (fechaHoy > fechaEvento) {
        req.flash("fechaEvento", "La fecha no puede ser anterior a mañana")
        res.redirect("/admin/nuevoEvento");
    } else if (fechaDisponible) {
        req.flash("fechaEvento2", "Esta fecha no esta disponible")
        res.redirect("/admin/nuevoEvento");
    } else {
        const evento = new eventos({
            titulo: req.body.titulo,
            fecha: req.body.fecha,
            imagen: req.file.filename,
            genero: req.body.genero,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            estado: true,
            lugar: "67fa83550a116aaecc4cfe81",
            usuario: req.user._id
        })
        await evento.addEvent()

        res.render("añadirEvento");
    }

});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/')
}
module.exports = router;
