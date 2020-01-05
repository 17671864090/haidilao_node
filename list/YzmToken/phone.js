
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var phoneSchema = new Schema({
    YAM_phone : Number,
    YAM_time: String,
    YAM_Status: Number,
    Use: String,
});
let Yzmphones = mongoose.model("phones", phoneSchema)
module.exports = Yzmphones
