const mongoose = require('mongoose');
const { Schema } = mongoose;

const entradaSchema = new Schema({
    cod_qr: { type: String, required: true },
    precio: {type: Number, required: true},
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'usuario', required: true },
    evento: { type: mongoose.Schema.Types.ObjectId, ref: 'evento', required: true },
    butaca: { type: mongoose.Schema.Types.ObjectId, ref: 'butaca', required: true }
});

//Para buscar la entrada mediante el evento
entradaSchema.methods.findByEvent= async function (idEvento) {
    const entrada = mongoose.model("entrada",entradaSchema)
        return await entrada.find({
            evento:idEvento
        })
}
entradaSchema.methods.findAll= async function () {
    const entrada = mongoose.model("entrada",entradaSchema)
        return await entrada.find()
}
entradaSchema.methods.findById= async function (id){
    const entrada = mongoose.model("entrada",entradaSchema)
    return await entrada.findById(id)
}

//PARa sacar las entradas del usuario
entradaSchema.methods.findByIdUser= async function (userId){
    const entrada = mongoose.model("entrada",entradaSchema)
    return await entrada.find({usuario:userId})
}

entradaSchema.methods.addEntrada = async function (){
    try {
        const result = await this.save();
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
    }
};
module.exports = mongoose.model('entrada', entradaSchema);