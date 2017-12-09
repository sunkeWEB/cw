let express = require('express');
let router = express.Router();
let mongoose = require('./../../database/mongooseConfig');
let DxTypes = require('./../../model/dxtype');
let readDxTypes = require('./readapi');   // 读取大类 小类 类型 函数
let readGcxms = require('./readxmapi'); // 读取 工程项目
let readKeHus = require('./readkh');  // 读取 客户

router.get('/', (req, res) => {
    res.json({
        code:0,
        msg:"success"
    });
});


router.get('/read',(req,res)=>{
    let data = 100; // 存 大类 小类
    let xm = 100;  // 存 项目信息
    readDxTypes().then(type => {
        data = type;
        return readGcxms();
    }).then(xms=>{
        xm = xms;
        return readKeHus();
    }).then(khs=>{
        res.json({
            code:0,
            msg:"数据获取成功",
            data:data,
            xm:xm,
            kh:khs
        });
    });
});

module.exports = router;