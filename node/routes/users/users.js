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
    console.log({name, pwd});
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
        res.cookie('userid', doc._id);
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
    quanxian.splice(quanxian.length-1,1); // 删掉最后一项空格
    // console.log(req.body);
    let ip = req.ip;  // 注册ip
    let time = new Date().getTime();  // 注册时间
    let obj = {
        name: name, // 用户名
        zsname:zsname, //真实姓名
        avatar:avatar, //头像
        defaultyhk:defaultyhk, //默认资金账户
        pwd: md5Pwd(pwd), // 密码
        ip: req.ip,  // 最近登录ip
        defaultxm:defaultxm, // 默认项目
        status: 0,  // 状态  是否激活 0 是激活
        time:new Date().getTime(),  // 最近登录时间
        dengji:dengji, // 级别  系统管理  普通记账 经理记账
        quanxian:quanxian // 权限数组
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
    let id = req.cookies.userid; // 获取用户的id
    Users.count({_id: id}, (err, doc) => {
        if (err) {
            return res.json({
                code: 1,
                msg: '系统错误'
            });
        }
        if (num === 0) {
            return res.json({
                code: 1,
                msg: '账号不正确'
            });
        } else {
            let {pwd} = req.body;
            Users.update({_id: id}, {$set: {pwd: md5Pwd(pwd)}}, (err, doc) => {
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

function md5Pwd(pwd) {
    let salt = "@`+=&%.397633183__=";
    return utils.md5(utils.md5(pwd + salt))
}

module.exports = router;