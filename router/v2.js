const express = require('express')
const router = express.Router();



const cardnumber =require('../list/cardnumber')
const Kalman =require('../list/kalmann')



router.post('/addshop', async (req,res) => {
    await cardnumber.create({shopname:req.body.name},function(err,data){
        res.send({
            data:data,
            code:"200",
            msg:"导入成功"
        })
    });
})

router.post('/getshop', async (req,res) => {
    await Kalman.find(function(err,data){
        res.send({
            data:data,
            code:"200",
            msg:"导入成功"
        })
    });
})











module.exports = router;
