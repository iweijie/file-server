var mongoose = require("mongoose");
var config = require("../../config/index");
var Schema = mongoose.Schema;
var db = mongoose.createConnection(config.mongoose.url,{ useNewUrlParser: true });

db.Schema = Schema;

db.on('error', function callback(err) { //监听是否有异常
    console.log("Connection error");
    console.log(err);
});
db.once('open', function callback() { //监听一次打开
    //在这里创建你的模式和模型
    console.log('success open!');
});
// db.on('connected', function callback() { //监听一次打开
//     //在这里创建你的模式和模型
//     console.log('success connected!');
// });

module.exports = db
