var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const session = require("express-session");
const flash = require('connect-flash');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const butacaRouter = require("./routes/butaca.js");
const sectorRouter = require("./routes/sector.js");

const usuarios = require('./models/usuarios.js');
const estadio = require('./models/estadio.js');
const sector = require('./models/sector.js');
const eventos = require('./models/eventos.js');
const butaca = require('./models/butaca.js');
const entrada = require('./models/entrada.js');

const { count } = require('console');

var app = express();
require("./database")
require("./passport/local-auth.js");

// view engine setup
app.set('port', 2000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "ElJamonLoMejorDeEspaña",
  resave: false,
  saveUninitialized: false,
  rolling: true, // para renovar la cookie de sesion
  cookie: {
    maxAge: 24 * 60 * 60 * 1000  // dura un dia
  }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.ErrorRegistro = req.flash('ErrorRegistro');
  app.locals.ErrorEmailRepetido = req.flash('ErrorEmailRepetido');
  app.locals.contraseñasNoCoincide = req.flash('contraseñasNoCoincide');
  app.locals.user = req.user;
  next();
});

//rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/butaca', butacaRouter);
app.use('/sector', sectorRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
