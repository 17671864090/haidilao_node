const express = require('express')
const router = express.Router();
const cardnumber =require('../list/cardnumber')
const Kalman =require('../list/kalmann')

router.post('/removeshopname', async (req,res) => {
    await cardnumber.remove({_id:req.body._id},function(err,data){
        res.send({
            data:data,
            msg:"删除成功",
            code:"200",
        })
    });
})
router.post('/removeshop', async (req,res) => {
    const data = req.body
    var arr = []
    for (let i in data) {
        arr.push(data[i]); //属性
    }
    console.log(arr)
    await Kalman.find({_id: { $in: arr }},function(err,data){
        data.forEach(function(item,index,arr){
            item.remove()
        })
        return  res.send({
            code:"200",
            msg:"删除成功"
        })
    });
})



router.post('/getshoplist', async (req,res) => {
    await cardnumber.find(function(err,data){
        res.send({
            data:data,
            code:"200",
            msg:"导入成功"
        })
    });
})
/**
 * 查询可用店铺 座位  卡密
 */
router.post('/getgoodslist', async (req,res) => {
    if(req.body.shopname && !req.body.shoptableXing){
        await Kalman.find({shopname:req.body.shopname, Usestore:1},function(err,data){
            if(data.length == 0){
                console.log('美哦与')
                res.send({
                    data:data,
                    code:"001",
                    msg:"导入123"
                })
                return
            }
            res.send({
                data:data,
                code:"200",
                msg:"导入成功"
            })
        });
    }else {
        if (req.body.shopname && req.body.shoptableXing) {
            console.log(req.body.shopname, req.body.shoptableXing)
            await Kalman.find({shopname: req.body.shopname, tableXing: req.body.shoptableXing, Usestore:1}, function (err, data) {
                res.send({
                    data: data,
                    code: "200",
                    msg: "导入成功"
                })
            });
        } else {
            await Kalman.find(function (err, data) {
                res.send({
                    data: data,
                    code: "200",
                    msg: "导入成功"
                })
            });

        }
    }
})


router.post('/getgoodslistname', async (req,res) => {
    await Kalman.find({"shopname":{$regex:req.body.shopnamee}  ,Usestore:1},function(err,data){
            // console.log(data)
        if(data.length == 0){
                res.send({
                    data:data,
                    code:"001",
                    msg:"导入123"
                })
                return
            }
            res.send({
                data:data,
                code:"200",
                msg:"导入成功"
            })
        });
})








router.post('/getgoodslistall', async (req,res) => {
    await Kalman.find({Usestore:1},function(err,data){
            if(data.length == 0){
                res.send({
                    data:data,
                    code:"001",
                    msg:"导入123"
                })
                return
            }
            res.send({
                data:data,
                code:"200",
                msg:"导入成功"
            })
        });
})






// 添加账号

const userlist = require('../list/userlist')
router.post('/adduserlist', async (req,res) => {
    const data = {
        username: req.body.name,
        password: req.body.password

    }
    await userlist.create(data, function (err, doc) {
        res.send({
            data: doc,
            code: "200",
            msg: "导入成功"
        })
    })
})

// 登陆账号
router.post('/getlogin', async (req,res) => {
    const data = {
        username: req.body.name,
        password: req.body.password

    }
    await userlist.create(data, function (err, doc) {
        res.send({
            data: doc,
            code: "200",
            msg: "登录成功"
        })
    })
})
// 添加卡密
router.post('/addaddgoods', async (req,res) => {
    const data ={
        date:req.body.data
    }
    var arr = []
    for (let i in req.body.data) {
        arr.push(req.body.data[i]); //属性
    }
    //构建新的数据
    let arr1 = new Array();
    for (var i=0; i<arr.length; i++){
        console.log(i)
        arr1[i] = {
            store:1,
            Usestore:1,
            shopname:data.date[i][3], //店名
            tableXing:data.date[i][4], //桌型
            numbber:data.date[i][2], //桌型
            date:data.date[i],
            price:req.body.price
        }
    }

    await Kalman.create(arr1,function(err,data){
         return res.send({
            data:data,
            code:"200",
            msg:"导入成功"
        })
    });
})
/**
 // })
 * 给数据库  加余额
 */
router.get('/getedpayorder', async (req,res) => {
    const mobile = req.query.name
    const addcredit2 = req.query.money
    const get = `SELECT * FROM hs_sz_yi_member WHERE mobile=${mobile}`; // 写你需要的sql代码，你要是不会写那我就真的没办法了
    connection.query(get,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        const meony = result[0].credit2
        const url2 = `UPDATE hs_sz_yi_member SET credit2=${Number(meony) + Number(addcredit2)} WHERE mobile=13800138000`;

        connection.query(url2,function(err,result){
            if(err){
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            console.log(result)
        });
    });
})


module.exports = router;
