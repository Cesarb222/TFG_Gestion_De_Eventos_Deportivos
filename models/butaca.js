const mongoose = require('mongoose');
const { Schema } = mongoose;

const butacaSchema = new Schema({
    fila: { type: String, required: true },
    num_butaca: { type: Number, required: true },
    sector: { type: mongoose.Schema.Types.ObjectId, ref: 'sector', required: true }
});

butacaSchema.methods.findButacasSector = async function (IDsector) {
        const butaca = mongoose.model("butaca",butacaSchema)
        return await butaca.find({
            sector:IDsector
        }).then(result => {return result})
        .catch(error => console.log(error));
}
butacaSchema.methods.findButaca = async function (IDsector,fila,numButaca) {
    const butaca = mongoose.model("butaca",butacaSchema)
    return await butaca.find({
        fila:fila,
        num_butaca:numButaca,
        sector:IDsector
    }).then(result => {return result})
    .catch(error => console.log(error));
}

butacaSchema.methods.addButaca = async function (){
    await this.save()
    .then(result => console.log(result))
    .catch(error => console.log(error));
};
module.exports = mongoose.model('butaca', butacaSchema);