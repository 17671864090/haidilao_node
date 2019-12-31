const express = require('express')
const router = express.Router();

const userinfo =require('../list/userinfo')

const formidable =require('formidable')

const JwtUtil = require('../config/jwt');

const order =require('../list/order')
const Kalman =require('../list/kalmann')

router.post('/delect',async(req,res)=>{
    console.log(req.body.id)
    userinfo.findOneAndRemove({_id:req.body.id},function (err,data) {
        res.send({
            status: 1,
            msg:"删除成功",
        })
    })
})



/**
 * 登录账号
 */
router.post('/getUserinfo',async(req,res)=>{
    let token = req.headers.authorization;
    let jwt = new JwtUtil(token);
    let result = jwt.verifyToken();
    const id = Number(result.id)
    const data = await userinfo.findOne({user_name:id})
    if(data == null){
        return res.send({code: 403, msg: '登录已过期'});
    }else {
        res.send({status: 1, data,})
    }
})
router.post('/getUser',async(req,res)=>{
    if(req.body.id){
        const data = await userinfo.findOne({_id:req.body.id})
        res.send({
            status: 1,
            data,
        })
    }else {
        const data = await userinfo.find()
        res.send({
            status: 1,
            data,
        })
    }
})
router.post('/updateUser',async(req,res)=>{
    const newAdmin = {
        _id: req.body._id,
        user_name: req.body.user_name,
        password: req.body.password,
        status: req.body.status,
        balance: req.body.balance,
        Agencydiscount: req.body.Agencydiscount,
        Remarks: req.body.Agencydiscount,

    }
    userinfo.findOne({_id:newAdmin._id},function (err,data) {
        data.user_name = req.body.user_name
        data.password = req.body.password
        data.status = req.body.status
        data.balance = Number(data.balance) + Number(req.body.Addbalance)
        data.Agencydiscount = req.body.Agencydiscount
        data.Remarks = req.body.Remarks
        data.save();
        res.send({
            code: 1,
            message:"修改成功",
        })
    })

})
// 客户登录系统
router.post('/login', async (req,res) => {
    const form = new formidable.IncomingForm();
        const {user_name, password, status = 1} = req.body;
        try{
            if (!user_name) {
                throw new Error('用户名参数错误')
            }else if(!password){
                throw new Error('密码参数错误')
            }
        }catch(err){
            console.log(err.message, err);
            res.send({
                status: 0,
                type: 'GET_ERROR_PARAM',
                message: err.message,
            })
            return
        }
        try{
            const admin = await userinfo.findOne({user_name:user_name})
            if (!admin) {
                const newAdmin = {
                    user_name,
                    password,
                    status,
                    balance:0,
                    Agencydiscount:100,
                    Remarks:''
                }
                await userinfo.create(newAdmin)
                let jwt = new JwtUtil({id:user_name});
                let token = jwt.generateToken();
                res.send({
                    token,
                    status: 1,
                    message: '注册管理员成功',
                })
            }else if(password.toString() != admin.password.toString()){
                console.log('管理员登录密码错误');
                res.send({
                    status: 0,
                    type: 'ERROR_PASSWORD',
                    message: '该用户已存在，密码输入错误',
                })
            }else{
                let jwt = new JwtUtil({id:user_name});
                let token = jwt.generateToken();
                console.log(token)
                res.send({
                    token,
                    admin,
                    status: 1,
                    message: '登录成功'
                })
            }
        }catch (e) {
            console.log('登录管理员失败', e);
            res.send({
                status: 0,
                type: 'LOGIN_ADMIN_FAILED',
                message: '登录管理员失败',
            })
        }
    // })
})
/**
 * 创建订单信息
 */
router.post('/PlaceOrder',async(req,res)=> {
    let token = req.headers.authorization;
    let jwt = new JwtUtil(token);
    let result = jwt.verifyToken();
    try{
        const data = await Kalman.find({_id:req.body.form._id})
        const userinfodata = await userinfo.findOne({user_name:result.id})
        if (data) {
            const dataa = {
                shopid: req.body.form,
                username: result.id,
                data:data,
                Remarks:userinfodata.Remarks,
                creationtime:new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
                paymentstate:0   //0为没支付  1为支付
            }

            console.log(new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString())




            const newdata = await order.create(dataa)
            res.send({
                _id:newdata._id,
                status: 1,
                success: '创建订单成功，座位锁定成功，请马上支付',
            })
        }else {
            res.send({
                status: 1,
                success: '手速慢了，该座位已被占用',
            })
        }
    }catch (e) {
        res.send({
            status: 0,
            success: '错误',
        })
    }
})
/**
 * 付款订单
 */
router.post('/payorder',async(req,res)=> {
    try{
        const data = await order.findOne({_id:req.body.id,paymentstate:0})
        if(data !== null){

            const data1 = await Kalman.findOne({_id:data.shopid,Usestore:-1})

            console.log(data1)

            if(!data1){
                let token = req.headers.authorization;
                let jwt = new JwtUtil(token);
                let result = jwt.verifyToken();
                userinfo.findOne({user_name:result.id},function (err,docs) {
                    if(Number(docs.balance) >= Number(data.data[0].price*docs.Agencydiscount/100)){
                        const price = data.data[0].price*docs.Agencydiscount/100*10
                        docs.balance = ((docs.balance*10 - price) / 10).toFixed(2)
                        docs.paymentstate = 1;
                        docs.save();
                        order.findOne({_id:req.body.id},function (err,data1) {
                            data1.paymentstate = 1;
                            data1.Actualdeduction = data.data[0].price*docs.Agencydiscount/100
                            data1.price = data.data[0].price
                            data1.save();
                            console.log(data1)
                        })


                        Kalman.findOne({_id:data.data[0]._id},function (err,newdoca) {
                            newdoca.Usestore = -1;
                            newdoca.save();
                            res.send({
                                data:newdoca._id,
                                status: 1,
                                success: '支付成功,马上出卡',
                            })
                        })
                    }else {
                        res.send({
                            status: 0,
                            success: '余额不足，自动解除订单',
                        })
                    }
                })
            }else{
                res.send({
                    status: 0,
                    success: '该订单已经被购买',
                })
            }
        }else{
            console.log(2)
            res.send({
                status: 0,
                success: '该订单已经失效',
            })
        }
    }catch (e) {

        console.log(e)
    }
})
/**
 * 查询订单信息
 */
router.post('/GetOrder',async(req,res)=>{
    if(req.body.id){
        try{
            Kalman.findOne({_id:req.body.id},function (err,data) {
                res.send({
                    data:data,
                    status: 1,
                    success: '支付成功,马上出卡',
                })
            })
        }catch (e) {

        }
    }else{
        try{
            order.find(function (err,data) {
                res.send({
                    data:data,
                    status: 1,
                    success: '支付成功,马上出卡',
                })
            })
        }catch (e) {

        }
    }
})
/**
 * 删除全部卡密
 */
router.post('/AllDeleteKalman',async(req,res)=>{
    try{
        Kalman.remove(function (err,data) {
            res.send({
                status: 1,
                success: '全部删除成功',
            })
        })
    }catch (e) {

    }
})
/**
 * 删除全部订单
 */
router.post('/AllDeleteOrder',async(req,res)=>{
    try{
        order.remove(function (err,data) {
            res.send({
                status: 1,
                success: '全部删除成功',
            })
        })
    }catch (e) {

    }
})



module.exports = router;
