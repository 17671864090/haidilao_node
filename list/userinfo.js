var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserinfoSchema = new Schema({
    user_name: String,
    password: String,
    balance: String,       //点数
    Agencydiscount:String, //折扣  总订单 * 0.2 = 实际扣款
    Remarks:'' //联系方式

});
let Userinfos = mongoose.model("Userinfos", UserinfoSchema)
module.exports = Userinfos
