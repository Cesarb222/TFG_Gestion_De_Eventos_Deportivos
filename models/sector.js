const mongoose = require('mongoose');
const { Schema } = mongoose;

const sectorSchema = new Schema({
    num_sector: { type: String, required: true },
    zona: { type: String, required: true },
    capacidad: { type: Number, required: true },
    estadio: { type: mongoose.Schema.Types.ObjectId, ref: 'estadio', required: true }
});

sectorSchema.methods.findByNameSector = async function (nombre) {
    const sectores = mongoose.model("sector",sectorSchema)
    const sector = await sectores.findOne({
        num_sector:nombre
    })
    return sector;
}



sectorSchema.methods.addSector = async function (){
    await this.save()
    .then(result => console.log(result))
    .catch(error => console.log(error));
};

module.exports = mongoose.model('sector', sectorSchema);