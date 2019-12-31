var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var KalmanSchema = new Schema({
    shopname: String,
    tableXing: String,
    price:String,   //价格
    date: Array,    //卡密内容
    numbber:Number,
    store:Number,//1没使用  2到店使用ok
    Usestore:Number //1未出卡   0 被锁定订单    -1 为已经付款成功
});
let Kalmann = mongoose.model("KalmanSchemas", KalmanSchema)
module.exports = Kalmann
