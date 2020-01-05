const formidable =require('formidable')
const JwtUtil = require('../../config/jwt');
const userinfo =require('../../list/userinfo')
class User{
    async login(req,res){
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
    }

}
module.exports = new User()
