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
    estado: {type:Boolean}
})

eventoSchema.methods.findAll = async function () {
    const eventos = mongoose.model("eventos",eventoSchema)
    return await eventos.find()
    .then(result =>{return result})
    .catch(error => console.log(error))
}

eventoSchema.methods.buscadorHeader = async function (palabra) {
    const eventos = mongoose.model("eventos",eventoSchema)
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

eventoSchema.methods.compararFechas = async function (fecha) {
    let fechaEvento = new Date(fecha);
    const eventos = mongoose.model("eventos", eventoSchema);

    try {
        const result = await eventos.find();
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