/**
 * 2019年12月4日 14:08:55
 * mongoose操作类(封装mongodb)
 */
const mongodb = require('mongoose');
operateData = function(collectionname,data){
    mongodb.connect("mongodb://60.205.178.222:27017/shop",function(err,client){
        if (err) {
            console.log(err)
        }else{
            console.log("连接成功");
        }
    })
}
module.exports = operateData;
