const v1 =require('./v1')
const v2 =require('./v2')
const v3 =require('./v3')

const v_yzm =require('./v_yzm')


module.exports = app => {
    app.use('/v1', v1);
    app.use('/v2', v2);
    app.use('/v3', v3);
    app.use('/v_yzm', v_yzm);

}
