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
        name:name,
        pwd:md5Pwd(pwd)
    };
    Users.findOne(obj,{pwd: 0, __v: 0},(err,doc)=>{
        if (err) {
            return res.json({
                code:1,
                msg:'系统错误'
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

// 注册操作
router.post('/register', (req, res) => {
    let {userName, userPwd} = req.body;  // 用户名 密码
    let ip = req.ip;  // 注册ip
    let time = new Date().getTime();  // 注册时间
    let obj = {
        name: userName,
        pwd: md5Pwd(userPwd),
        ip: ip,
        time: time
    };
    Users.count({name: userName}, (err, doc) => {
        if (err) {
            return res.json({
                code: 1,
                msg: '系统错误'
            });
        }
        if (doc>=1) {
            return res.json({
                code:1,
                msg:'用户名已经被注册'
            });
        }else{
            const userModl = new Users(obj);
            userModl.save((err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误 注册失败"
                    });
                }
                const {name, _id} = doc;
                res.cookie('userid', _id);
                return res.json({
                    code: 0,
                    msg: "注册成功",
                    data: {name, _id}
                });
            });
        }
    });
});

function md5Pwd(pwd) {
    let salt = "@`+=&%.397633183__=";
    return utils.md5(utils.md5(pwd + salt))
}

module.exports = router;