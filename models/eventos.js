const mongoose = require("mongoose")

const { Schema } = mongoose

const eventoSchema = new Schema({
    titulo: { type:String,required:true },
    fecha: {type:Date,required:true},
    imagen:{type:String},
    genero:{type:String,required:true},
    descripcion: {type:String,required:true},
    lugar: {type: mongoose.Schema.Types.ObjectId, ref:'estadio',required:true},
    precio: {type:Number,required:true},
    estado: {type:Boolean},
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'usuario', required: true }
})

eventoSchema.methods.findAll = async function () {
    const eventos = mongoose.model("eventos",eventoSchema)
    return await eventos.find()
    .then(result =>{return result})
    .catch(error => console.log(error))
}

eventoSchema.methods.findEventosUsuarios = async function (idUsuario) {
    const eventos = mongoose.model("eventos",eventoSchema)
    return await eventos.find({usuario:idUsuario})
    .then(result =>{return result})
    .catch(error => console.log(error))
}


//PAra buscar los eventos con dicho genero
eventoSchema.methods.findGenero = async function (genero) {
    const eventos = mongoose.model("eventos",eventoSchema)
    return await eventos.find({estado:true,genero:genero})
    .then(result =>{return result})
    .catch(error => console.log(error))
}

eventoSchema.methods.eventosDisponibles = async function () {
    const eventos = mongoose.model("eventos",eventoSchema)
    return await eventos.find({estado:true})
    .then(result =>{return result})
    .catch(error => console.log(error))
}
//para actualizar el estado del evento
eventoSchema.methods.updateEstado= async function(id,estadoEvento){
    const eventos = mongoose.model("eventos",eventoSchema)
    //Con new: true, nos devolvera el nuevo resultadoo tras actualizarlo
    return await eventos.findByIdAndUpdate(id,{estado:estadoEvento},{new: true})
    .then(result =>{return result})
    .catch(error => console.log(error))
}
//para actualizar la fecha del evento
eventoSchema.methods.updateFecha= async function(id,FechaEvento){
    const eventos = mongoose.model("eventos",eventoSchema)
    return await eventos.findByIdAndUpdate(id,{fecha:FechaEvento},{new: true})
    .then(result =>{return result})
    .catch(error => console.log(error))
}

//Para hacer el buscador delk header, utilizo el objeto RegExp para la busqueda
eventoSchema.methods.buscadorHeader = async function (palabra) {
    const eventos = mongoose.model("eventos",eventoSchema)
    //la i significa para encontrar busquedas que no le de importancia a las mayusculas o minusculas
    const regex = new RegExp(palabra,"i")
    return await eventos.find({titulo:regex})
    .then(result =>{return result})
    .catch(error => console.log(error))
}

eventoSchema.methods.findTitulo = async function(title){
    const eventos = mongoose.model("eventos",eventoSchema)
    return await eventos.find({
        "titulo":title
    })
    .then(result =>{return result})
    .catch(error => console.log(error))
}

eventoSchema.methods.findByID = async function(id){
    const eventos = mongoose.model("eventos",eventoSchema)
    return await eventos.findById(id)
    .then(result =>{return result})
    .catch(error => console.log(error))
}

//Metodo para comparar la fechas con otros eventos
eventoSchema.methods.compararFechas = async function (fecha) {
    let fechaEvento = new Date(fecha);
    const eventos = mongoose.model("eventos", eventoSchema);

    try {
        //busco los eventos que estan activos  y lo comparo si coincide alguna
        //fecha con retorna true lo que nos indica que hay un evento esa fehca,
        //si no retorbna false con lo que nos indica que hay un evento en esa fecha
        const result = await eventos.find({estado:true});
        console.log("aaa",result)
        for (const item of result) {
            let fechas = new Date(item.fecha);
            if (
                fechas.getFullYear() === fechaEvento.getFullYear() &&
                fechas.getMonth() === fechaEvento.getMonth() &&
                fechas.getDate() === fechaEvento.getDate()
            ) {
                return true;
            }
        }
        return false; 
    } catch (error) {
        console.error("Error en compararFechas:", error);
        return false;
    }
};

eventoSchema.methods.findEventAndUpdateImage = async function(fecha,genero,titulo,img){
    const eventos = mongoose.model("eventos",eventoSchema)
    return await eventos.findOneAndUpdate({
        titulo:titulo,
        fecha:fecha,
        genero:genero
    },{
        imagen:"img"
    },{ new: true }).then(result => console.log(result))
    .catch(error => console.log(error));
}

eventoSchema.methods.addEvent = async function (){
    await this.save()
    .then(result => console.log(result))
    .catch(error => console.log(error));
};

module.exports = mongoose.model("eventos",eventoSchema)