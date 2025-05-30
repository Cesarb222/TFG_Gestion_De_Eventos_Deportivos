var express = require('express');
var router = express.Router();
const passport = require('passport');
const entrada = require('../models/entrada');
const butaca = require('../models/butaca');
const sector = require('../models/sector');
const estadio = require('../models/estadio');
const eventos = require('../models/eventos');
const usuarios = require('../models/usuarios');
const nodemailer = require("nodemailer")
const { nodemailerKey,JWT } = require("../keys");
const jwt = require('jsonwebtoken');


router.get("/signup", (req, res, next) => {
  res.render("signup")
})

router.post("/signup", passport.authenticate("local-signup", {
  successRedirect: "/",
  failureRedirect: '/users/signup',
  failureFlash: true //Si hay error si esta esto en truue masnda un mensaje
}))


router.get("/signin", (req, res, next) => {
  res.render("login")
})

router.post("/signin", passport.authenticate("local-signin", {
  successRedirect: "/",
  failureRedirect: '/users/signin',
  failureFlash: true
}))

router.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}))

router.get("/google/callback", passport.authenticate("google", {
  successRedirect: "/",
  failureRedirect: "/users/signup"
}))

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});


router.get("/recuperar", (req, res, next) => {
  res.render("recuperarContraseñaForm")
})

router.post("/recuperar", async (req, res, next) => {
  let correo = req.body.correo
  let usuario = new usuarios()
  usuario = await usuario.findByEmail(correo)
  if(!usuario){
    req.flash("recuperarEmail", "Este email no existe")
    res.redirect("/users/recuperar");
  }
  if(usuario && usuario.googleID){
    req.flash("cuentaGoogle", "Este email esta registrado en otro formato")
    res.redirect("/users/recuperar");
  }

  if(usuario && !usuario.googleID){
    const token = generarToken(usuario.correo)
    const enlace = `http://localhost:3000/users/nuevaContrasena?token=${token}`;
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
                        subject: "Recuperar contraseña",
                        text: "Recuperar Contraseña", // plain‑text body
                        html: `
                <div style="background:#f7f7f7;padding:30px 0;">
                    <div style="max-width:420px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 2px 8px #0001;padding:32px 24px;text-align:center;">
                        <h2 style="color:#ff6700;margin-bottom:12px;">${usuario.nombre}</h2>
                        <p style="color:#333;font-size:16px;margin-bottom:18px;">
                            Hola, Para restablecer tu contraseña, utiliza el siguiente enlace, ignóralo si no lo solicitaste "
                        </p>
                        <a href="${enlace}" style="display:inline-block;margin-top:10px;padding:10px 24px;background:#ff6700;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
                          Cambiar contraseña
                      </a>
                    </div>
                </div>
            `
                    });
    
                    console.log("Message sent:", info.messageId);
                })();
  }

  

  res.render("recuperarContraseñaForm")
})

router.get("/nuevaContrasena", (req,res,next)=>{
  //Pillo el token por query params
  const { token } = req.query;

  try {
    //verifico el token si ha expirado me manda al catch
    const payload = verificarToken(token);
    res.render("nuevaContraseña", { email: payload.email, token });
  } catch (error) {
    res.send("Enlace inválido o expirado");
  }
})

router.post("/nuevaContrasena", async (req,res,next)=>{
  const { token, password,emailForm,rpassword } = req.body
  try {
    //verifico el token si ha expirado me manda al catch
    const { email } = verificarToken(token);

    let usuario = new usuarios()
    if(password != rpassword){
      //Guardo un mensaje temporal en caso de que sea diferente.
      req.flash("recuperarContraseñaFallo","Las contraseñas no coinciden, intentelo de nuevo")
      res.redirect("/users/recuperar")
      return
    }
    let contraseñaEncriptada = await usuario.encriptar(password)

    let us = await usuario.recuperarContraseña(email,contraseñaEncriptada)


    res.redirect("/users/signin");
  } catch (error) {
    res.send("Token inválido o expirado");
  }
});


router.get("/perfil",isAuthenticated, function (req, res, next) {
  let usuario = req.user
  console.log(usuario)
  res.render("perfil", { usuario })
})
router.get("/misEntradas",isAuthenticated, async function (req, res, next) {
  let usuario = req.user.id
  let entradas = new entrada()

  entradas = await entradas.findByIdUser(usuario)
  console.log(entradas.length)

  let arrayEntrada = []
  for (const item of entradas) {

    let eventoId = new eventos();
    eventoId = await eventoId.findByID(item.evento);

    let butacaId = new butaca();
    butacaId = await butacaId.findByID(item.butaca);

    let sectorId = new sector();
    sectorId = await sectorId.findByZonaSector(butacaId.sector.toString());

    let estadioId = new estadio();
    estadioId = await estadioId.findByIDEstadio(sectorId.estadio.toString());

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
      fecha: eventoId.fecha,
      eventoEstado: eventoId.estado
    });
  }
  res.render("misEntradas",{arrayEntrada})
})
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
}
function generarToken(email) {
  return jwt.sign({ email }, JWT.JWT_SECRET, { expiresIn: '5m' });
}

function verificarToken(token) {
  return jwt.verify(token, JWT.JWT_SECRET);
}


module.exports = router;
