const mongoose = require('mongoose');
const { Schema } = mongoose;

const estadioSchema = new Schema({
    nombre: { type: String, required: true },
    localidad: { type: String, required: true },
    cp: { type: Number, required: true },
    provincia: { type: String, required: true },
    CA: { type: String, required: true },
    direccion: { type: String, required: true },
});

estadioSchema.methods.findByID= async function (id) {
    const estadio = mongoose.model("estadio",estadioSchema)
    return await estadio.findById(id)
}

estadioSchema.methods.addEstadio = async function (){
    await this.save()
    .then(result => console.log(result))
    .catch(error => console.log(error));
};
module.exports = mongoose.model('estadio', estadioSchema);