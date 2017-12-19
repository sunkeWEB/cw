let express = require('express');
let router = express.Router();
let utils = require('utility');
let mongoose = require('./../../database/mongooseConfig');
let Users = require('./../../model/users');


/*  和用户操作有关 */

router.get('/', function (req, res, next) {
    res.json({
        code: 1,
        msg: 'Hello World'
    });
});

//登录操作
router.post('/login', (req, res) => {
    let {name, pwd} = req.body;
    let obj = {
        name: name,
        pwd: md5Pwd(pwd)
    };
    Users.findOne(obj, {pwd: 0, __v: 0}, (err, doc) => {
        if (err) {
            return res.json({
                code: 1,
                msg: '系统错误'
            });
        }
        if (!doc) {
            return res.json({
                code: 1,
                msg: '用户名或者密码错误'
            });
        }
        return res.json({
            code: 0,
            msg: '登录成功',
            data: doc
        });
    });
});

// 创建账号
router.post('/register', (req, res) => {
    let {name, zsname, avatar, defaultyhk, pwd, defaultxm, dengji} = req.body;
    let quanxian = req.body.quanxian.split(' ');
    quanxian.splice(quanxian.length - 1, 1); // 删掉最后一项空格
    // console.log(req.body);
    let ip = req.ip;  // 注册ip
    let time = new Date().getTime();  // 注册时间
    let obj = {
        name: name, // 用户名
        zsname: zsname, //真实姓名
        avatar: avatar, //头像
        defaultyhk: defaultyhk, //默认资金账户
        pwd: md5Pwd(pwd), // 密码
        ip: req.ip,  // 最近登录ip
        defaultxm: defaultxm, // 默认项目
        status: 0,  // 状态  是否激活 0 是激活
        time: new Date().getTime(),  // 最近登录时间
        dengji: dengji, // 级别  系统管理  普通记账 经理记账
        quanxian: quanxian // 权限数组
    };
    console.log(quanxian);
    Users.count({name: name}, (err, doc) => {
        if (err) {
            return res.json({
                code: 1,
                msg: '系统错误'
            });
        }
        if (doc >= 1) {
            return res.json({
                code: 1,
                msg: '用户名已经存在'
            });
        } else {
            const userModl = new Users(obj);
            userModl.save((err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误 添加失败"
                    });
                }
                const {name, _id} = doc;
                res.cookie('userid', _id);
                return res.json({
                    code: 0,
                    msg: "添加成功",
                    data: {name, _id}
                });
            });
        }
    });
});

//修改密码
router.post('/updatepwd', (req, res) => {
    let {old, newpwd} = req.body;
    let name = req.cookies.username; // 获取用户名
    Users.count({name: name, pwd: md5Pwd(old)}, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: '系统错误'
            });
        }
        if (num === 0) {
            return res.json({
                code: 1,
                msg: '原密码错误'
            });
        } else {
            Users.update({_id: id}, {$set: {pwd: md5Pwd(newpwd)}}, (err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: '系统错误'
                    });
                } else {
                    return res.json({
                        code: 0,
                        msg: '修改密码成功',
                        data: doc
                    });
                }
            })
        }
    })
});

// 权限认证
router.post('/auth', (req, res) => {
    let id = req.cookies.username;
    console.log(" auth " + id);
    Users.find({_id: id}, {quanxian: 100, _id: 0,dengji:100,zsname:100}, (err, doc) => {
        if (err) {
            return res.json({
                code: 1,
                msg: "系统错误 请稍后再尝试"
            });
        }
        if (doc) {
            res.json({
                code: 0,
                msg: "权限获取成功",
                data: doc
            });
        }
    });
});

function md5Pwd(pwd) {
    let salt = "@`+=&%.397633183__=";
    return utils.md5(utils.md5(pwd + salt))
}


// 测试权限创建账号
router.post('/register1', (req, res) => {
    let {name, zsname, avatar, defaultyhk, pwd, defaultxm, dengji} = req.body;
    let quanxian = req.body.quanxian.split(' ');
    quanxian.splice(quanxian.length - 1, 1);
    let k = [];
    k = mm(quanxian);
    // 删掉最后一项空格
    // console.log(quanxian);
    // let quanxian = [
    //     {
    //         name:"收支入账",
    //         list:{
    //             read:0,    // 0表示具有权限 增删改 浏览 权限
    //             update:0,
    //             create:0,
    //             delete:0
    //         }
    //     }
    // ];
    let ip = req.ip;  // 注册ip
    let time = new Date().getTime();  // 注册时间
    let obj = {
        name: name, // 用户名
        zsname: zsname, //真实姓名
        avatar: avatar, //头像
        defaultyhk: defaultyhk, //默认资金账户
        pwd: md5Pwd(pwd), // 密码
        ip: req.ip,  // 最近登录ip
        defaultxm: defaultxm, // 默认项目
        status: 0,  // 状态  是否激活 0 是激活
        time: new Date().getTime(),  // 最近登录时间
        dengji: dengji, // 级别  系统管理  普通记账 经理记账
        quanxian: k // 权限数组
    };
    // console.log(quanxian);
    Users.count({name: name}, (err, doc) => {
        if (err) {
            return res.json({
                code: 1,
                msg: '系统错误'
            });
        }
        if (doc >= 1) {
            return res.json({
                code: 1,
                msg: '用户名已经存在'
            });
        } else {
            const userModl = new Users(obj);
            userModl.save((err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误 添加失败"
                    });
                }
                const {name, _id} = doc;
                res.cookie('userid', _id);
                return res.json({
                    code: 0,
                    msg: "添加成功",
                    data: {name, _id}
                });
            });
        }
    });
});

function mm(arr) {
    let kk = [];
    for (let a = 0; a < arr.length; a++) {
        let obj = {
            name: arr[a],
            list: {
                read: 0,
                update: 0,
                create: 0,
                delete: 0,
            }
        };
        kk.push(obj);
    }
    return kk;
}

// 删除 修改 项目
router.post('/delusers',(req,res)=>{
    let {id} = req.body;
    Gcxms.count({_id:id},(err,num)=>{
        if (err) {
            return res.json({
                code:1,
                msg:"系统错误 稍后再尝试"
            });
        }

        if (num===0) {
            return res.json({
                code:1,
                msg:"你删除的账户管理不存在"
            });
        }

        if (num>=1) {
            Gcxms.remove({_id:id},(err,doc)=>{
                if (err) {
                    return res.json({
                        code:1,
                        msg:"系统错误 稍后再尝试",
                        data:[]
                    });
                }
                if (doc) {
                    return res.json({
                        code:0,
                        msg:"系统删除成功",
                        data:doc
                    });
                }
            })
        }

    })
});
// router.post('/updatexms',(req,res)=>{
//     let {sid, data} = req.body;
//     let obj = JSON.parse(data);
//     Gcxms.count({_id:sid}, (err, num) => {
//         if (err) {
//             return res.json({
//                 code: 1,
//                 msg: '系统错误'
//             });
//         }
//         if (num === 0) {
//             return res.json({
//                 code: 1,
//                 msg: '没找到账户的信息'
//             });
//         } else {
//             Gcxms.update({_id:sid},obj,function (err, doc) {
//                 if (err) {
//                     return res.json({
//                         code:1,
//                         msg:"系统错误",
//                         data:err
//                     });
//                 }
//                 if (doc) {
//                     return res.json({
//                         code:0,
//                         msg:"修改成功",
//                         data:doc
//                     })
//                 }
//             })
//         }
//     })
// });

router.post('/checklogin',(req,res)=>{
    let id = req.cookies.username;
    Users.count({_id:id},(err,num)=>{
        if (err) {
            return res.json({
                code:1,
                msg:"系统错误未检查到登陆信息"
            })
        }
        if (num>=1) {
            return res.json({
                code:0,
                msg:"login success"
            })
        }else{
            return res.json({
                code:1,
                msg:"未检查到登陆信息"
            })
        }
    });
});

module.exports = router;