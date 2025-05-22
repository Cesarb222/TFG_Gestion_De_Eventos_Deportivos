var express = require('express');
var router = express.Router();
const eventos = require("../models/eventos")
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: function(req,res,cb){
        cb(null, path.join(__dirname, "../public/images/imagenesEventos"));
    },
    filename: function(req,file, cb){
        if(path.extname(file.originalname) == ".jpg" 
            || path.extname(file.originalname) == ".jpeg" 
            || path.extname(file.originalname) == ".webp" 
            ||path.extname(file.originalname) == ".png"){
                cb(null, file.fieldname + '-' + file.originalname)
        }else{
            cb(new Error("Formato invalido, se permite: .jpg, .jpeg, .webp, .png"))
            }
            
    }
})
const upload = multer({storage})
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render("admin");
});
router.get('/nuevoEvento', function(req, res, next) {
    res.render("añadirEvento");
});

router.post('/nuevoEvento', upload.single('imagen') , async function(req, res, next) {
    console.log(req.file)
    const event = new eventos()

    const fechaHoy = new Date()
    const fechaEvento = new Date(req.body.fecha)
    let fechaDisponible = await event.compararFechas(fechaEvento)
    if(fechaHoy > fechaEvento){
        req.flash("fechaEvento", "La fecha no puede ser anterior a mañana")
        res.redirect("/admin/nuevoEvento");
    }else if(fechaDisponible){
        req.flash("fechaEvento2", "Esta fecha no esta disponible")
        res.redirect("/admin/nuevoEvento");
    }else{
        const evento = new eventos({
            titulo:req.body.titulo,
            fecha:req.body.fecha,
            imagen:req.file.filename,
            genero:req.body.genero,
            descripcion:req.body.descripcion,
            precio:req.body.precio,
            estado:true,
            lugar:"67fa83550a116aaecc4cfe81"
        })
        await evento.addEvent()
    
        res.render("añadirEvento");
    }
    
});

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/')
}
module.exports = router;
