const mongoose = require('mongoose');
const { Schema } = mongoose;

const sectorSchema = new Schema({
    num_sector: { type: String, required: true },
    zona: { type: String, required: true },
    capacidad: { type: Number, required: true },
    estadio: { type: mongoose.Schema.Types.ObjectId, ref: 'estadio', required: true },
    multiplicador:{type:Number}
});

//Busco por nombre del sector
sectorSchema.methods.findByNameSector = async function (nombre) {
    const sectores = mongoose.model("sector",sectorSchema)
    const sector = await sectores.findOne({
        num_sector:nombre
    })
    return sector;
}
//Busco por la zona del sector
sectorSchema.methods.findByZonaSector = async function (id) {
    const sectores = mongoose.model("sector",sectorSchema)
    const sector = await sectores.findById(id)
    return sector;
}

sectorSchema.methods.findAll = async function (id) {
    const sectores = mongoose.model("sector",sectorSchema)
    const sector = await sectores.find()
    return sector;
}

sectorSchema.methods.addSector = async function (){
    await this.save()
    .then(result => console.log(result))
    .catch(error => console.log(error));
};

module.exports = mongoose.model('sector', sectorSchema);