var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var KrderSchema = new Schema({
    username: String,
    shopid: String,
    data:Array,
    paymentstate:Number,
    creationtime:String,   //订单创建时间
    Paymentmethod:String,  //支付方式
    Actualdeduction:String,//实际扣款
    Paymentstatus:String,
    price:String,
    Remarks:String //客户备注


});
let orders = mongoose.model("orders", KrderSchema)
module.exports = orders
