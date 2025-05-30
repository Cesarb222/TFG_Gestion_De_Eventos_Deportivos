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

//Le añado el plugin para poder añadir el metodo de buscar o crear para el usuario de google

usuarioSchema.plugin(findOrCreate)

usuarioSchema.methods.encriptar =  function (contraseña){
    return bcrypt.hashSync(contraseña,bcrypt.genSaltSync(10))
}

usuarioSchema.methods.compararContraseña = async function (contraseñaIngresada) {
    if (!this.googleID) {
        return await bcrypt.compare(contraseñaIngresada, this.contraseña);
    }
    return false;
};
//Para guardar el email
usuarioSchema.methods.findByEmail= async (email)=>{
    //ESto se refiere al modelo que vamos a guardar para busacr el usuario
    const usuario = mongoose.model("usuarios",usuarioSchema);
    return await usuario.findOne({"correo":email})
        .then(result =>{return result})
        .catch(error => console.log(error))
}

//Para recuperar la contraseñas
usuarioSchema.methods.recuperarContraseña= async (email,contraseña)=>{
    //ESto se refiere al modelo que vamos a guardar para busacr el usuario
    const usuario = mongoose.model("usuarios",usuarioSchema);
    //utilizo el set para actualizar
    return await usuario.findOneAndUpdate(
        { correo: email},
        { $set: { contraseña: contraseña } },
        { new: true }
    )
        .then(result =>{return result})
        .catch(error => console.log(error))
}

usuarioSchema.methods.findById= async (id)=>{
    //ESto se refiere al modelo que vamos a guardar para busacr el usuario
    const usuario = mongoose.model("usuarios",usuarioSchema);
    return await usuario.findById(id)
        .then(result =>{return result})
        .catch(error => console.log(error))
}

usuarioSchema.methods.updateRol= async (id,rol)=>{
    //ESto se refiere al modelo que vamos a guardar para busacr el usuario
    const usuario = mongoose.model("usuarios",usuarioSchema);
    return await usuario.findByIdAndUpdate(id,{rol:rol},{new: true})
        .then(result =>{return result})
        .catch(error => console.log(error))
}

usuarioSchema.methods.buscadorEmail = async function (email) {
    const usuarios = mongoose.model("usuarios",usuarioSchema)
    const regex = new RegExp(email,"i")
    return await usuarios.find({correo:regex})
    .then(result =>{return result})
    .catch(error => console.log(error))
}
usuarioSchema.methods.addUser = async function (){
    await this.save()
    .then(result => console.log(result))
    .catch(error => console.log(error));
};

module.exports = mongoose.model("usuarios",usuarioSchema)