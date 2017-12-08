const mongoose = require('mongoose');

//定义模型字段  跟数据库匹配
let userSchema = new mongoose.Schema({
    name: String,
    pwd: String,
    ip: String,
    status: Number,
    time:String
});

module.exports = mongoose.model('users', userSchema);