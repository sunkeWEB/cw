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
            time: Number, // 时间
            sm: String, // 备注
            dddtype:String, // 收支名称大类
            pid:Number, // 收支类型 1是收入 0是支出
            form:String, // 银行名称
            price:Number, // 价格
            czy:String // 操作者名字
        }
    ],
    zzdz: [  //转账对账
        {
            pid:Number, // 转账类型 1是收入 0是支出
            form:String,
            to:String,
            time:Number,
            zcprice:Number,
            zcsm:String,
            jzr:String
        }
    ]

});

module.exports = mongoose.model('acountguanlis', accountGuanliSchema);