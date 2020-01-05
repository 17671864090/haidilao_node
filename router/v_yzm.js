const express = require('express')
const router = express.Router();

const YzmToken =require('../controller/YzmToken/index')


router.post('/GetHM2Str', YzmToken.GetHM2Str)   //添加手机号

router.post('/binding', YzmToken.binding)   //绑定号码


router.post('/add', YzmToken.Add)   //添加手机号

router.post('/mkHM2Str', YzmToken.mkHM2Str)   //号码指定

router.post('/GetYzm2Str', YzmToken.GetYzm2Str)   //获取验证码

router.post('/GetHM2StrAll', YzmToken.GetHM2StrAll)   //获取全部手机号
router.post('/addYZMCODE', YzmToken.addYZMCODE)   //获取全部手机号



module.exports = router;
