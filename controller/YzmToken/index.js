const Yzmphones =require('../../list/YzmToken/phone')
const YzmToken =require('../../list/YzmToken/YzmToken')
const Tokeninfo =require('../../list/YzmToken/Tokeninfo')
var moment = require('moment');
var axios = require('axios');
class CityHandle {
    constructor() {
        this.GetHM2Str = this.GetHM2Str.bind(this)
    }
    /**
     * 添加手机号码
     */
    Add(req, res, next){
        var arr = []
        var data = []
        for (let i in req.body) {
            arr.push(req.body[i]); //属性
        }
        var time = moment().format('YYYY-MM-DD HH:mm:ss')
        var   p=new   Date(Date.parse(time .replace(/-/g,"/")));
        arr.forEach((item)=>{
            data.push({
                YAM_phone: item,
                YAM_time: p,
                YAM_Status: 0,
                Use: 1,
                Token:null

            });
        })
        Yzmphones.create(data,function (err,data) {
            res.send({
                data
            })
        })
    }
    /**
     * 对指定的号码  进行 延期释放
     */
    async binding(req,res,next){
        var m = new Date();
        var n = new Date(m.getTime() + 1000 * 60 * 60); //延期2分钟后自动释放
        Yzmphones.findOne({YAM_phone:req.body.data},function (err,data) {
            if(data){
                data.Use = 0
                data.YAM_time = n
                data.save()
                res.send({
                    code:200,
                    msg:"续约号码成功"
                })
            }else{
                res.send({
                    code:200,
                    msg:"当前账号库为空"
                })
            }
        })
    }
    /**
     * 返回一条指定号码...
     * @param req
     * @param res
     * @param next
     * @constructor
     */
    async GetHM2Str(req,res,next){
        var that = this
        await Tokeninfo.findOne({"Authorizationcode":req.body.token},function (err,data) {
            try {
                var frequency = data.frequency
                if(data.frequency > 0){
                    // 获取当前授权码是否获取过
                    if(data.YAM_phone !== 0){
                        // console.log(data.YAM_phone)
                        return res.send({
                            code:200,
                            msg:"获取之前号码成功",
                            YAM_phone:data.YAM_phone,
                            frequency
                        })
                    }else{
                        Yzmphones.findOne({Use:1,YAM_Status:1,Token:null || undefined},function (err,data) {

                            console.log(data)

                            that.token(req.body.token,data.YAM_phone)

                            if(data){
                                data.Use = 0
                                data.save()
                                that.mkHM2Str(data.YAM_phone)
                                return res.send({
                                    code:200,
                                    msg:"指定号码成功",
                                    YAM_phone:data.YAM_phone,
                                    frequency
                                })
                            }else{
                                return res.send({
                                    code:200,
                                    msg:"当前账号库为空"
                                })
                            }
                        })
                    }
                }else{
                    return res.send({
                        code:0,
                        msg:"授权码已失效"
                    })
                }
            }catch (e) {
                return res.send({
                    code:0,
                    msg:"授权码已失效"
                })
            }

        })
    }

    async token(a,b){
        await Tokeninfo.findOne({"Authorizationcode":a},function (err,data) {
            data.YAM_phone = b
            data.save()
        })
        await Yzmphones.find({"YAM_phone":b},function (err,data) {
            data.forEach(function(item,index,arr){
                item.Token = b
                item.save()
            })
        })
    }


    async GetHM2StrAll(req,res,next){
        await Yzmphones.find(function (err,data) {
            if(data){
                res.send({
                    code:200,
                    msg:"获取号码成功",
                    YAM:data
                })
            }else{
                res.send({
                    code:200,
                    msg:"当前账号库为空."
                })
            }
        })
    }
    //生成授权码
    async addYZMCODE(req,res,next){
        var data = []
        var m = new Date();
        var n = new Date(m.getTime() + 1000 * 60 * 60 * 12); //12小时时效期
        for(let i=0;i<30;i++){
            var returnStr = "",
            range = 6,
                arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            for(var k=0; k<range; k++){
                var index = Math.round(Math.random() * (arr.length-1));
                returnStr += arr[index];
            }
            data.push({Authorizationcode:returnStr,frequency:3,YAM_phone:0})
        }
        Tokeninfo.create(data,function (err,data) {
            res.send({
                data
            })
        })


    }
    /**
     * 获取指定号码
     * @returns {Promise<void>}
     */
    async mkHM2Str(YAM_phone){
        var token = null
        var hm = YAM_phone
        await YzmToken.findOne(function (err,docs) {
            token = docs.YAM_Token
        })
        // // 指定号码
        await axios.get(`http://www.mili18.com:9180/service.asmx/mkHM2Str?token=${token}&xmid=12865&hm=${hm}&op=1&pk=&rj=`).then((res=>{
            return res
        }))
    }
    /**
     * 获取验证码
     * @param res
     * @param req
     * @param err
     * @returns {Promise<void>}
     * @constructor
     */
    async GetYzm2Str(res,req,err){
        var xmid = 12865
        var hm = res.body.hm
        var token = res.body.token
        await YzmToken.findOne(function (err,docs) {
            axios.get(`http://www.mili18.com:9180/service.asmx/GetYzm2Str?token=${docs.YAM_Token}&xmid=${xmid}&hm=${hm}&sf=1`).then((res=>{
                console.log("获取验证码成功", res.data)
                if(typeof(res.data) !== 'number'){
                    Tokeninfo.findOne({"Authorizationcode":token},function (err,data) {
                        data.frequency -= 1
                        data.save()
                    })

                    // Yzmphones.remove({YAM_phone:hm},function (err,data) {
                    //     console.log(data)
                    // })

                    req.send({
                        code:200,
                        data:res.data
                    })
                }else{
                    req.send({
                        code:0,
                        msg:res.data
                    })
                }
            }))
        })
    }
    /**
     * 自动检测手机号码状态
     * @param req
     * @param res
     * @param next
     */
    async asas(req, res, next){
        var time = moment().format('YYYY-DD-MM  HH:mm:ss')
        // console.log(`手机号码开始检测-------------------------------------${time}`);
        var token = null
        const xmid = 12865
        await YzmToken.findOne(function (err,docs) {
            token = docs.YAM_Token
        })
        await Yzmphones.find(function (err,data) {
            // console.log('待检测账号总条数----------' + data.length)
            var numbers = 0;
            for (let i=0;i<data.length;i++) {
                axios.get(`http://www.mili18.com:9180/service.asmx/mkHM2Str?token=${token}&xmid=12865&hm=${data[i].YAM_phone}&op=1&pk=&rj=`)
                    .then(function (response) {
                        // console.log("状态码获取成功" + response.data + "当前账号:" + i)
                        Yzmphones.find({YAM_phone:data[i].YAM_phone},function (err,data1) {
                            data1.forEach(function(item,index,arr){
                                item.YAM_Status = response.data
                                item.YAM_time = new Date()
                                item.save()
                            })
                        })
                        // console.log(response.data)
                    })
                    .catch(function (error) {
                        // console.log('error' + data[i].YAM_phone)
                    });
                // 检测当前手机号是否延期释放
                var m = new Date();
                var n = new Date(m.getTime());
                if(n.toString() <= data[i].YAM_time){
                    console.log("当前账号不被释放" + data[i].YAM_phone)
                }else{
                    Yzmphones.find({YAM_phone:data[i].YAM_phone},function (err,dataa) {
                        dataa.forEach(function(item,index,arr){
                            item.Use = 1
                            item.YAM_time = n
                            item.save()
                        })
                    })
                    axios.get(`http://www.mili18.com:9180/service.asmx/sfHm?token=${token}&hm=${data[i].YAM_phone}`).then((res=>{

                    })).catch((err=>{
                        // console.log(err)
                    })) //释放当前账号
                }

            }

            console.log(numbers)

        })
        // console.log(`手机号码完成检测-------------------------------------${time}`)
    }
}
var ins01 = new CityHandle();
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();


 rule.second =[0,10,20,30,40,50]

// var times2    = [1,6,11,16,21,26,31,36,41,46,51,56];
// rule.minute  = times2;
//




var j = schedule.scheduleJob(rule, function(){
    ins01.asas()
})
module.exports = new CityHandle()