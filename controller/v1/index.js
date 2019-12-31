class CityHandle {
    GetIndex(req, res, next){
        res.send({
            status: 0,
            type: 'ERROR_CAPTCHA',
            message: '验证码失效',
        })
        return
    }
}
module.exports = new CityHandle()