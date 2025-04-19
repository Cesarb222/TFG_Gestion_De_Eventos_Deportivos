const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const findOrCreate = require("mongoose-findorcreate")

const { Schema } = mongoose

const usuarioSchema = new Schema({
    nombre: { type:String,required:true },
    ap: {type:String,required:true},
    rol: {type:String,required:true},
    correo:{type:String, required:true,unique:true},
    edad: { type: Date,},
    contraseña: { type:String},
    googleID: {type:String}
})

//Le añado el plugin para poder añadir el metodo de buscar o crear

usuarioSchema.plugin(findOrCreate)
usuarioSchema.methods.encriptar = function (contraseña){
    return bcrypt.hashSync(contraseña,bcrypt.genSaltSync(10))
}

usuarioSchema.methods.compararContraseña = function (contraseña){
    return bcrypt.compareSync(contraseña,this.contraseña)
}

usuarioSchema.methods.findByEmail= async (email)=>{
    //ESto se refiere al modelo que vamos a guardar para busacr el usuario
    const usuario = mongoose.model("usuarios",usuarioSchema);
    return await usuario.findOne({"correo":email})
        .then(result =>{return result})
        .catch(error => console.log(error))
}

usuarioSchema.methods.addUser = async function (){
    await this.save()
    .then(result => console.log(result))
    .catch(error => console.log(error));
};

module.exports = mongoose.model("usuarios",usuarioSchema)