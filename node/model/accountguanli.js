const mongoose = require('mongoose');

// 账户管理表
let accountGuanliSchema = new mongoose.Schema({
    dtype:String, // 排序 只能是数字
    name:String, // 名称
    defaultprice:Number, // 默认余额
    sm:String, // 说明
    createtime:String,// 创建时间
    price: String, // 当前账户余额
    status:0, // 0 是正常
    ip:String, // 添加的ip
    // szdz:[   // 这里还需做扩展
    //     {
    //         time:String,
    //         type:String,
    //
    //     }
    // ],
    // zzdz:[
    //
    // ]

});

module.exports = mongoose.model('acountguanlis', accountGuanliSchema);