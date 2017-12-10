const mongoose = require('mongoose');

//定义模型字段  跟数据库匹配
let userSchema = new mongoose.Schema({
    name: String, // 用户名
    zsname:String, //真实姓名
    avatar:String, //头像
    defaultyhk:String, //默认资金账户
    pwd: String, // 密码
    ip: String,  // 最近登录ip
    defaultxm:String, // 默认项目
    status: Number,  // 状态  是否激活 0 是激活
    time: String,  // 最近登录时间
    dengji:String, // 级别  系统管理  普通记账 经理记账
    quanxian:Array // 权限数组
},{ versionKey: false});

module.exports = mongoose.model('users', userSchema);