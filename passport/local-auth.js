const passport = require("passport")
const LocalStrategy = require('passport-local').Strategy;
const usuarios = require("../models/usuarios")
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const { AuthGoogle } = require('../keys');


//esto recibe un usuario 
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const usuario = await usuarios.findById(id);
    done(null, usuario);
});

//Autenticación Con GOOGLE 
passport.use("google",new GoogleStrategy({
    clientID: AuthGoogle.CLIENT_ID,
    clientSecret: AuthGoogle.SECRET_CLIENT,
    callbackURL: "http://localhost:3000/users/google/callback",
}, function(accessToken,refreshToken, profile, cb) {
    console.log(profile)
    
    usuarios.findOrCreate({googleID: profile.id},{
        nombre: profile.name.givenName,
        ap: profile.name.familyName,
        rol: "usuario",
        correo: profile.emails[0].value,
        googleID:profile.id
    }, function(err,usuario){
        return cb(err,usuario)
    })
}));


passport.use("local-signup", new LocalStrategy({
    usernameField: "email", //Aqui ponemos el name que tiene en el formulario
    passwordField: "password",
    passReqToCallback: true  //Con esto permitimos que se pase el objeto req
}, async (req, email, password, done) => {
    const { nombre, apellido, fechaNacimiento,confirmarPassword } = req.body
    const fechaUsuario = new Date(fechaNacimiento)
    const fechaHoy = new Date()
    let edad = fechaHoy.getFullYear() - fechaUsuario.getFullYear();
    let mes = fechaHoy.getMonth() - fechaUsuario.getMonth();
    let dia = fechaHoy.getDate() - fechaUsuario.getDate();

    //Para saber si es mayor de 16 años y pueda realizar compras
    //Se verifican que las contraseñas son iguales y que el usuario no exista
    //si falla algo nos hace el callback y nos muestra el mensaje temporal del
    //middleware del req.flash
    if (edad > 16 || (edad === 16 && (mes > 0 || (mes === 0 && dia >= 0)))) {
        const user = new usuarios()
        if(confirmarPassword == password){
            const userExiste = await user.findByEmail(email)
            if (!userExiste) {
                const usuario = new usuarios({
                    nombre: nombre,
                    ap: apellido,
                    rol: "usuario",
                    correo: email,
                    edad: fechaNacimiento,
                    contraseña: user.encriptar(password)
                })
    
                await usuario.addUser()
                    .then(result => console.log(result))
                    .catch(error => console.log(error));
                done(null, usuario);
        }else {
            return done(null, false, req.flash("ErrorEmailRepetido", "Este email ya esta en uso."))
        }
        
        } else {
            return done(null, false, req.flash("contraseñasNoCoincide", "Las contraseñas no coinciden."))
        }

    } else {
        return done(null, false, req.flash("ErrorRegistro", "No puedes registrarte al ser menor de 16 años"))
    }

}));

//Para el login
passport.use('local-signin', new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, async (req, email, password, done) => {
    let user = new usuarios()
    user = await user.findByEmail(email);

    if (!user) {
        return done(null, false, req.flash('ErrorEmailRepetido', 'No hay registrado este correo'));
    }

    if (user.googleID) {
        return done(null, false, req.flash('google', 'Este correo está registrado con Google'));
    }

    const contraseñaValida = await user.compararContraseña(password);
    if (!contraseñaValida) {
        return done(null, false, req.flash('contraseñasNoCoincide', 'Contraseña incorrecta'));
    }

    return done(null, user);
}));