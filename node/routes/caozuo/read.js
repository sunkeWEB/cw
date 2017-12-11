let express = require('express');
let router = express.Router();
let mongoose = require('./../../database/mongooseConfig');
let DxTypes = require('./../../model/dxtype');
let readDxTypes = require('./readapi');   // 读取大类 小类 类型 函数
let readGcxms = require('./readxmapi'); // 读取 工程项目
let readKeHus = require('./readkh');  // 读取 客户
let readSrzcs = require('./readsrcz'); // 收入支出
let Srzcs = require('./../../model/srzcs');

router.get('/sort',(req,res)=>{
    Srzcs.count({},(err,num)=>{
        res.json({
            num:num
        });
    })
});

router.get('/', (req, res) => {
    res.json({
        code:0,
        msg:"success"
    });
});

// 收入记账 支出记账
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

function sersch(searchValue) {
    let obj = [
        {
            dtype: {$regex:searchValue}
        }, {
            xtype: {$regex:searchValue}
        }, {
            price: {$regex:searchValue}
        }, {
            time: {$regex:searchValue}
        }, {
            zjzh: {$regex:searchValue}
        }, {
            yshb: {$regex:searchValue}
        }, {
            ywxm: {$regex:searchValue}
        }, {
            jbr: {$regex:searchValue}
        }, {
            sm: {$regex:searchValue}
        }]; // 查询的条件
    return obj;
}

//收支流水列表
router.get('/readsrzc',(req,res)=>{
    let {order,offset,limit,sort} = req.query; // 获取查询条件
    let searchValue = req.query.search;
    let k = [];
    let searchValue1 = searchValue ? k=sersch(searchValue) : k ;
    let kkk = {};
    if (k.length>1) {
        kkk = {
            '$or':k
        };
    }
    let doc1,total;
    let query = Srzcs.find(kkk, (err, doc) => {
        doc1 = doc;
    });
    query.count((err, num) => {
        total = num;
    });
    Srzcs.find(kkk,(err,doc)=>{
        res.json({
            code:0,
            msg:"数据获取成功",
            data:doc,
            total:total
        });
    });
});










// router.get('/readsrzc',(req,res)=>{
//     let obj ={order,offset,limit,sort,search} = req.query; // 获取查询条件
//     readSrzcs(obj).then(data=>{
//         console.log(data);
//         return res.json({
//             code:1,
//             msg:"获取数据成功",
//             data:data
//         });
//     })
// });


module.exports = router;