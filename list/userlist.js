var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: String,
    password: String,


});
let userlist = mongoose.model("users", userSchema)
module.exports = userlist
