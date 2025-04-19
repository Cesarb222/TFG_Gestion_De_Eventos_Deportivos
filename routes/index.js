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

module.exports = router;
