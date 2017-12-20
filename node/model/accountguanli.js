const mongoose = require('mongoose');

// 账户管理表
let accountGuanliSchema = new mongoose.Schema({
    dtype: String, // 排序 只能是数字
    name: String, // 名称
    defaultprice: Number, // 默认余额
    sm: String, // 说明
    createtime: Number,// 创建时间
    price: Number, // 当前账户余额
    status: 0, // 0 是正常
    ip: String, // 添加的ip
    "szdz": [   // 这里还需做扩展  收支转账
        {
            time: Number
        }
    ],
    zzdz: [  //转账对账
        {
            time: Number,
            type: String,
            price:Number,   // 金额
            czy:String,
            sm:String // 备注
        }
    ]

});

module.exports = mongoose.model('acountguanlis', accountGuanliSchema);