var express = require('express');
var router = express.Router();
const events = require('../models/eventos');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const evento = new events()
  const eventos = await evento.findAll()
  console.log(req.user)
  res.render('index', { eventos, usuario:req.user});
});

router.get('/ver', function(req, res, next) {
  console.log(req.session.infoEntrada)
  res.send("dale a tu cuerpo alegria macarena");
});
module.exports = router;
