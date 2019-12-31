
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var cardnumberSchema = new Schema({
    shopname: String,
});
let cardnumber = mongoose.model("cardnumbers", cardnumberSchema)
module.exports = cardnumber
