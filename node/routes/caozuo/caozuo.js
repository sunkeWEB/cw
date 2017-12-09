let express = require('express');
let router = express.Router();
let mongoose = require('./../../database/mongooseConfig');
let DxTypes = require('./../../model/dxtype');  // 大类小类
let Gcxms = require('./../../model/gcxm'); // 项目
let KeHus = require('./../../model/kefu'); // 客户
let Srzcs = require('./../../model/srzcs'); // 收入支出表
// 这里面只做 添加 删除 修改 

// 测试
router.get('/', (req, res) => {
    res.json({
        code: 0,
        msg: 'success'
    });
});

// 添加大类
router.post('/addTypes', (req, res) => {
    let {type, name, sm} = req.body;
    console.log({type, name, sm});
    DxTypes.count({name: name, type: type}, (err, count) => {
        if (err) {
            return res.json({
                code: 1,
                msg: "系统错误"
            });
        }
        if (count >= 1) {
            return res.json({
                code: 1,
                msg: "已经有相同的数据  不能添加"
            });
        } else {
            let obj = {
                type: type,
                name: name,
                sm: sm
            };
            const DxtypeModl = new DxTypes(obj);
            DxtypeModl.save((err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误 添加失败"
                    });
                }
                if (doc) {
                    res.json({
                        code: 0,
                        msg: "添加成功",
                        data: doc
                    });
                }
            });
        }
    })
});

// 添加小类
router.post('/addxtypes', (req, res) => {
    let {sname, name, sm} = req.body;
    DxTypes.count({name: sname}, (err, num) => {  // 先检查大类是否存在
        if (err) {
            return res.json({
                code: 1,
                msg: '系统错误'
            });
        }
        if (num >= 1) {
            DxTypes.update({name: sname}, {$addToSet: {'sunlist': {name: name, dtype: 1, sm: sm}}}, (err, doc) => {
                if (err) {
                    res.json({
                        err: err
                    });
                } else {
                    res.json({
                        data: doc
                    });
                }
            });
        }
        else {
            return res.json({
                code: 1,
                msg: "大类不存在"
            });
        }
    });
});

// 添加项目
router.post('/addxm',(req,res)=>{
    let {name, sm} = req.body;
    Gcxms.count({name:name},(err,num)=>{
        if (err) {
            res.json({
                code:1,
                msg:"系统错误"
            });
        }
        if (num>=1) {
            res.json({
                code:1,
                msg:"项目名称已经存在"
            });
        }else{
            let obj = {
                name:name,
                sm:sm,
                status:0,
                ip:req.ip,
                time:new Date().getTime()
            };
            let GcxmModel = new Gcxms(obj);
            GcxmModel.save((err,doc)=>{
                if (err) {
                    return res.json({
                        code:1,
                        msg:"系统错误"
                    });
                }
                if (doc) {
                    return res.json({
                        code:0,
                        msg:"项目添加成功",
                        data:doc
                    });
                }
            });
        }

    });
});

//添加客户信息
router.post('/addkh', (req, res) => {
    let { name, phone, cz, email, adders, bz } = req.body;
    KeHus.count({name:name,phone:phone,email:email},(err,num)=>{
        if (err) {
            return res.json({
                code:1,
                msg:"系统错误"
            });
        }
        if (num>=1) {
            return res.json({
                code:1,
                msg:"你添加的客户可能已经存在"
            });
        }else{
            let obj = {
                name:name,
                phone:phone,
                cz:cz,
                email:email,
                adders:adders,
                bz:bz
            };
            let kehuModel = new KeHus(obj);
            kehuModel.save((err, doc) => {
                if (err) {
                    return res.json({
                        code:1,
                        msg:"系统错误 添加失败"
                    });
                }else{
                    return res.json({
                        code:0,
                        msg:"客户信息添加成功",
                        data:doc
                    });
                }
            });
        }
    })
});

//收入记账 支出记账
// type: Number, // 0 是支出  1是收入
    // time: String,
router.post('/addsrzc',(req,res)=>{
  let {type,xtype,price,zjzh,yshb,ywxm,jbr,sm,time,dtype} = req.body;
    console.log({type,xtype,price,zjzh,yshb,ywxm,jbr,sm,time,dtype});
    let obj = {
        type:type,
        xtype:xtype,
        price:price,
        zjzh:zjzh,
        yshb:yshb,
        ywxm:ywxm,
        time:time,
        jbr:jbr,
        sm:sm,
        dtype:dtype
    };
    Srzcs.count(obj,(err,num)=>{
        if (err) {
            return res.json({
                code:1,
                msg:err
            });
        }
        if (num>=1) {
            return res.json({
                code:1,
                msg:"你添加信息可能已经存在"
            });
        }else {
            let SrzcsModel = new Srzcs(obj);
            SrzcsModel.save((err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误 添加失败"
                    });
                } else {
                    return res.json({
                        code: 0,
                        msg: "信息添加成功1",
                        data: doc
                    });
                }
            });
        }
    });
});

module.exports = router;