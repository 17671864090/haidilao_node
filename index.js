const express = require('express'),
    bodyParser = require('body-parser')
const app = express()
const mongodb = require('mongoose');
// 连接mongoodb数据库
mongodb.connect("mongodb://60.205.178.222:27017/app",  { useNewUrlParser: true, useUnifiedTopology: true } ,  function(err,client){
    if (err) {
        console.log(err)
    }else{
        console.log("数据库连接成功了");
    }
})
const routers =require('./router/index.js')
const JwtUtil = require('./config/jwt');

    app.use(function (req, res, next) {
        if(
            req.url == '/v1/getgoodslist'  ||
            req.url == '/v1/login' ||
            req.url == '/v_yzm/GetHM2Str' ||
            req.url == '/v_yzm/binding' ||
            req.url == '/v_yzm/add' ||
            req.url == '/v_yzm/mkHM2Str' ||
            req.url == '/v_yzm/GetYzm2Str' ||
            req.url == '/v_yzm/GetHM2StrAll' ||
            req.url == '/v_yzm/addYZMCODE'
        ){
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
const Token =require('./list/YzmToken/YzmToken')
var axios = require('axios');
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.second =[0,10,20,30,40,50]
// rule.minute =30;
// rule.second =0;
var j = schedule.scheduleJob(rule, function(){
    console.log('现在时间：',new Date(),'账号秘钥获取成功');
    const username = 931308832
    const password = "ma931308832"
    axios.get(`http://www.mili18.com:9180/service.asmx/UserLoginStr?name=${username}&psw=${password}`)
        .then(function (response) {
            Token.findOne(function (err,data1) {
                data1.YAM_Token = response.data
                data1.save()
            })
        })
        .catch(function (error) {
            console.log('定时获取Token失败,请立即检查系统');
        });
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
routers(app);
app.use(bodyParser.urlencoded({ extended: true }))
    app.listen(3009);