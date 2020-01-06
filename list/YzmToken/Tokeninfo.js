
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TokeninfosSchema = new Schema({
    Authorizationcode : String,
    frequency:Number,
    PrescriptionTime:String,
    YAM_phone:Number
});
let Tokeninfos = mongoose.model("Tokeninfos", TokeninfosSchema)
module.exports = Tokeninfos
