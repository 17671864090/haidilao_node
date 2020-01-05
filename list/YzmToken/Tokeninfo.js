
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TokeninfosSchema = new Schema({
    Authorizationcode : Number,
});
let Tokeninfos = mongoose.model("Tokeninfos", TokeninfosSchema)
module.exports = Tokeninfos
