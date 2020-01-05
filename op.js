var moment = require('moment');
var time = moment().format('YYYY-MM-DD HH:mm:ss')
var d=new Date(Date.parse(time .replace(/-/g,"/")));


var m = new Date();
var n = new Date(m.getTime() + 1000 * 60);


console.log(d);