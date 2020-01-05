
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var yzmtokenSchema = new Schema({
    YAM_username: String,
    YAM_password: String,
    YAM_Token: String,
});
let YzmToken = mongoose.model("yzmtoken", yzmtokenSchema)
module.exports = YzmToken
