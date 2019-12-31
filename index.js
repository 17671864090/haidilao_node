const express = require('express'),
    bodyParser = require('body-parser')
const app = express()
const mongodb = require('mongoose');
// 连接mongoodb数据库
mongodb.connect("mongodb://60.205.178.222:27017/cs",  { useNewUrlParser: true, useUnifiedTopology: true } ,  function(err,client){
    if (err) {
        console.log(err)
    }else{
        console.log("数据库连接成功");
    }
})
const routers =require('./router/index.js')
const JwtUtil = require('./config/jwt');

    app.use(function (req, res, next) {
        if(req.url == '/v1/getgoodslist'  || req.url == '/v3/login' || req.url == '/getgoodslistname'){
            next()
        }else{
            let token = req.headers.authorization;
            let jwt = new JwtUtil(token);
            let result = jwt.verifyToken();

            if (req.url == '/v1/removeshop'

                ||req.url=='/v3/delect'
                || req.url == '/v1/adduserlist'
                || req.url == '/v1/getshoplist'
                || req.url == '/v1/addaddgoods'
                || req.url == '/v3/getUser'
                || req.url == '/v3/updateUser'
                || req.url == '/v3/AllDeleteKalman'
                || req.url == '/v3/AllDeleteOrder'

            ){
                if(result.id == 931308832){
                    next();
                }else{
                    res.send({code: 403, msg: '登录已过期,后端不是的你的'});
                }
            }else {
                // // // 如果考验通过就next，否则就返回登陆信息不正确
                if (result == 'err') {
                    console.log(result);
                    res.send({code: 403, msg: '登录已过期,请重新登录'});
                } else {
                    next();
                }
            }
        }
    });




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
routers(app);
app.use(bodyParser.urlencoded({ extended: true }))
app.listen(3009);