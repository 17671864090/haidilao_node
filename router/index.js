const v1 =require('./v1')
const v2 =require('./v2')
const v3 =require('./v3')
module.exports = app => {
    app.use('/v1', v1);
    app.use('/v2', v2);
    app.use('/v3', v3);
}
