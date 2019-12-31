var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shopSchema = new Schema({
    shopname: String,
});
let shopSchema = mongoose.model("shops", shopSchema)
module.exports = shopSchema
