const mongoose = require("mongoose")

const { Schema } = mongoose

const eventoSchema = new Schema({
    titulo: { type:String,required:true },
    fecha: {type:Date,required:true},
    imagen:{type:String},
    genero:{type:String,required:true},
    descripcion: {type:String,required:true},
    lugar: {type: mongoose.Schema.Types.ObjectId, ref:'estadio',required:true}
})

eventoSchema.methods.findEvents= async function(fInicio,fFin){
    const hoy = new Date();
    try{
        if(fInicio>fFin){
            throw new Error("La fecha de busqueda inicial no puede ser mayor a hoy")
        }else if(fInicio>hoy){
            throw new Error("La fecha de busqueda inicial no puede ser ")
        }else{
            const eventos = mongoose.model("eventos",eventoSchema);
            return await eventos.find({
                fecha:{ $gte: fInicio, $lte: fFin}
            })
        }
        
    }catch(error){
        console.log(error)
    }
}

eventoSchema.methods.findAll = async function () {
    const eventos = mongoose.model("eventos",eventoSchema)
    return await eventos.find()
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
        
eventoSchema.methods.addEvent = async function (){
    await this.save()
    .then(result => console.log(result))
    .catch(error => console.log(error));
};

module.exports = mongoose.model("eventos",eventoSchema)