//管理员登录信息
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var login = new Schema({
    username: Number,
    password: String,
});

let logins = mongoose.model("login", login)
module.exports = logins
