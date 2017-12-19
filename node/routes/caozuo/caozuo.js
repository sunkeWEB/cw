let express = require('express');
let router = express.Router();
let mongoose = require('./../../database/mongooseConfig');
let DxTypes = require('./../../model/dxtype');  // 大类小类
let Gcxms = require('./../../model/gcxm'); // 项目
let KeHus = require('./../../model/kefu'); // 客户
let Srzcs = require('./../../model/srzcs'); // 收入支出表
let Staffs = require('./../../model/staff'); // 员工表
let Accounts = require('./../../model/accountypes'); // 账户类型表
let Accountgls = require('./../../model/accountguanli'); // 账户
let Users = require('./../../model/users'); // 用户
// 这里面只做 添加 删除 修改

// 测试
router.get('/', (req, res) => {
    res.json({
        code: 0,
        msg: 'success'
    });
});

// ------------------------添加------------------------
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
router.post('/addxm', (req, res) => {
    let {name, sm} = req.body;
    Gcxms.count({name: name}, (err, num) => {
        if (err) {
            res.json({
                code: 1,
                msg: "系统错误"
            });
        }
        if (num >= 1) {
            res.json({
                code: 1,
                msg: "项目名称已经存在"
            });
        } else {
            let obj = {
                name: name,
                sm: sm,
                status: 0,
                ip: req.ip,
                time: new Date().getTime()
            };
            let GcxmModel = new Gcxms(obj);
            GcxmModel.save((err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误"
                    });
                }
                if (doc) {
                    return res.json({
                        code: 0,
                        msg: "项目添加成功",
                        data: doc
                    });
                }
            });
        }

    });
});

//添加客户信息
router.post('/addkh', (req, res) => {
    let {name, phone, cz, email, adders, bz} = req.body;
    KeHus.count({name: name, phone: phone, email: email}, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: "系统错误"
            });
        }
        if (num >= 1) {
            return res.json({
                code: 1,
                msg: "你添加的客户可能已经存在"
            });
        } else {
            let obj = {
                name: name,
                phone: phone,
                cz: cz,
                email: email,
                adders: adders,
                bz: bz,
                status: 0
            };
            let kehuModel = new KeHus(obj);
            kehuModel.save((err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误 添加失败"
                    });
                } else {
                    return res.json({
                        code: 0,
                        msg: "客户信息添加成功",
                        data: doc
                    });
                }
            });
        }
    })
});

//收入记账 支出记账
// type: Number, // 0 是支出  1是收入
// time: String,
router.post('/addsrzc', (req, res) => {
    let {type, xtype, price, zjzh, yshb, ywxm, jbr, sm, time, dtype,jzr} = req.body;
    let stringTime = "2014-07-10 10:21:12";
    let timestamp = Date.parse(new Date(`${time} 10:21:12`)) / 1000;
    console.log(timestamp);
    let obj = {
        type: type,
        xtype: xtype,
        price: price,
        zjzh: zjzh,
        yshb: yshb,
        ywxm: ywxm,
        time: timestamp,
        jbr: jbr,
        sm: sm,
        dtype: dtype,
        jzr:jzr
    };
    Srzcs.count(obj, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: err
            });
        }
        if (num >= 1) {
            return res.json({
                code: 1,
                msg: "你添加信息可能已经存在"
            });
        } else {
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

// 添加员工
router.post('/addstaff', (req, res) => {
    let {name, phone, birthday, department, bz} = req.body;
    let obj = {
        name: name,
        phone: phone,
        birthday: birthday,
        department: department,
        bz: bz
    };
    Staffs.count(obj, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: err
            });
        }
        if (num >= 1) {
            return res.json({
                code: 1,
                msg: "你添加信息可能已经存在"
            });
        } else {
            let StaffModel = new Staffs(obj);
            StaffModel.save((err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误 添加失败"
                    });
                } else {
                    return res.json({
                        code: 0,
                        msg: "信息添加成功",
                        data: doc
                    });
                }
            });
        }
    })
});

//添加账户类型
router.post('/addacount', (req, res) => {
    let {sort, name} = req.body;
    Accounts.count({name: name}, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: err
            });
        }
        if (num >= 1) {
            return res.json({
                code: 1,
                msg: "你添加信息可能已经存在"
            });
        } else {
            let obj = {
                sort: sort,
                name: name
            };
            let AccountModel = new Accounts(obj);
            AccountModel.save((err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误 添加失败"
                    });
                } else {
                    return res.json({
                        code: 0,
                        msg: "信息添加成功",
                        data: doc
                    });
                }
            });
        }
    });
});

// 添加账户
router.post('/addacountzh', (req, res) => {
    let {name, type, sm, price} = req.body;
    Accountgls.count({name: name}, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: err
            });
        }
        if (num >= 1) {
            return res.json({
                code: 1,
                msg: "你添加信息可能已经存在"
            });
        } else {
            let obj = {
                name: name,
                dtype: type,
                sm: sm,
                defaultprice: price, // 添加的金额
                price: price,  // 当前的金额
                status: 0, // 默认正常 账户
                createtime: new Date().getTime(),
                ip: req.ip
            };
            let AccountglModel = new Accountgls(obj);
            AccountglModel.save((err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误 添加失败"
                    });
                } else {
                    return res.json({
                        code: 0,
                        msg: "信息添加成功",
                        data: doc
                    });
                }
            });
        }
    });
});


// ------------------------读取------------------------

// ----------------------  删除修改操作 -----------------------------

// 删除 修改 项目
router.post('/delxm', (req, res) => {
    let {id} = req.body;
    Srzcs.count({_id: id}, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: "系统错误 稍后再尝试"
            });
        }

        if (num === 0) {
            return res.json({
                code: 1,
                msg: "你删除的项目不存在"
            });
        }

        if (num >= 1) {
            Srzcs.remove({_id: id}, (err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误 稍后再尝试",
                        data: []
                    });
                }
                if (doc) {
                    return res.json({
                        code: 0,
                        msg: "系统删除成功",
                        data: doc
                    });
                }
            })
        }

    })
});
router.post('/updatexm', (req, res) => {
    let {pid, xtype, price, zjzh, yshb, ywxm, jbr, sm, time, dtype} = req.body;
    let obj = {
        xtype: xtype,
        price: price,
        zjzh: zjzh,
        yshb: yshb,
        ywxm: ywxm,
        time: time,
        jbr: jbr,
        sm: sm,
        dtype: dtype
    };
    Srzcs.update({_id: pid}, obj, function (err, doc) {
        if (err) {
            return res.json({
                code: 1,
                msg: "系统错误",
                data: msg
            });
        }
        if (doc) {
            return res.json({
                code: 0,
                msg: "修改成功",
                data: doc
            })
        }
    })
});

// 删除 修改 账户管理
router.post('/delaccountzh', (req, res) => {
    let {id} = req.body;
    Accountgls.count({_id: id}, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: "系统错误 稍后再尝试"
            });
        }

        if (num === 0) {
            return res.json({
                code: 1,
                msg: "你删除的账户管理不存在"
            });
        }

        if (num >= 1) {
            Accountgls.remove({_id: id}, (err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误 稍后再尝试",
                        data: []
                    });
                }
                if (doc) {
                    return res.json({
                        code: 0,
                        msg: "系统删除成功",
                        data: doc
                    });
                }
            })
        }

    })
});
router.post('/updateaccount', (req, res) => {
    let {sid, data} = req.body;
    let obj = JSON.parse(data);
    Accountgls.count({_id: sid}, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: '系统错误'
            });
        }
        if (num === 0) {
            return res.json({
                code: 1,
                msg: '没找到账户的信息'
            });
        } else {
            Accountgls.update({_id: sid}, obj, function (err, doc) {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误",
                        data: err
                    });
                }
                if (doc) {
                    return res.json({
                        code: 0,
                        msg: "修改成功",
                        data: doc
                    })
                }
            })
        }
    })
});

// 删除 修改 账户类型
router.post('/delaaccount', (req, res) => {
    let {id} = req.body;
    Accounts.count({_id: id}, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: "系统错误 稍后再尝试"
            });
        }

        if (num === 0) {
            return res.json({
                code: 1,
                msg: "你删除的账户管理不存在"
            });
        }

        if (num >= 1) {
            Accounts.remove({_id: id}, (err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误 稍后再尝试",
                        data: []
                    });
                }
                if (doc) {
                    return res.json({
                        code: 0,
                        msg: "系统删除成功",
                        data: doc
                    });
                }
            })
        }

    })
});
router.post('/updateacc', (req, res) => {
    let {sid, data} = req.body;
    let obj = JSON.parse(data);
    Accounts.count({_id: sid}, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: '系统错误'
            });
        }
        if (num === 0) {
            return res.json({
                code: 1,
                msg: '没找到账户的信息'
            });
        } else {
            Accounts.update({_id: sid}, obj, function (err, doc) {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误",
                        data: err
                    });
                }
                if (doc) {
                    return res.json({
                        code: 0,
                        msg: "修改成功",
                        data: doc
                    })
                }
            })
        }
    })
});

// 删除 修改 大类
router.post('/deldtype', (req, res) => {
    let {id} = req.body;
    DxTypes.count({_id: id}, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: "系统错误 稍后再尝试"
            });
        }

        if (num === 0) {
            return res.json({
                code: 1,
                msg: "你删除的账户管理不存在"
            });
        }

        if (num >= 1) {
            DxTypes.remove({_id: id}, (err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误 稍后再尝试",
                        data: []
                    });
                }
                if (doc) {
                    return res.json({
                        code: 0,
                        msg: "系统删除成功",
                        data: doc
                    });
                }
            })
        }

    })
});
router.post('/updatetype', (req, res) => {
    let {sid, data} = req.body;
    let obj = JSON.parse(data);
    DxTypes.count({_id: sid}, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: '系统错误'
            });
        }
        if (num === 0) {
            return res.json({
                code: 1,
                msg: '没找到账户的信息'
            });
        } else {
            DxTypes.update({_id: sid}, obj, function (err, doc) {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误",
                        data: err
                    });
                }
                if (doc) {
                    return res.json({
                        code: 0,
                        msg: "修改成功",
                        data: doc
                    })
                }
            })
        }
    })
});

// 删除 修改 客户
router.post('/delkehus', (req, res) => {
    let {id} = req.body;
    KeHus.count({_id: id}, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: "系统错误 稍后再尝试"
            });
        }

        if (num === 0) {
            return res.json({
                code: 1,
                msg: "你删除的账户管理不存在"
            });
        }

        if (num >= 1) {
            KeHus.remove({_id: id}, (err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误 稍后再尝试",
                        data: []
                    });
                }
                if (doc) {
                    return res.json({
                        code: 0,
                        msg: "系统删除成功",
                        data: doc
                    });
                }
            })
        }

    })
});
router.post('/updatekefus', (req, res) => {
    let {sid, data} = req.body;
    let obj = JSON.parse(data);
    KeHus.count({_id: sid}, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: '系统错误'
            });
        }
        if (num === 0) {
            return res.json({
                code: 1,
                msg: '没找到账户的信息'
            });
        } else {
            KeHus.update({_id: sid}, obj, function (err, doc) {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误",
                        data: err
                    });
                }
                if (doc) {
                    return res.json({
                        code: 0,
                        msg: "修改成功",
                        data: doc
                    })
                }
            })
        }
    })
});

// 删除 修改 员工
router.post('/delstaff', (req, res) => {
    let {id} = req.body;
    Staffs.count({_id: id}, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: "系统错误 稍后再尝试"
            });
        }

        if (num === 0) {
            return res.json({
                code: 1,
                msg: "你删除的账户管理不存在"
            });
        }

        if (num >= 1) {
            Staffs.remove({_id: id}, (err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误 稍后再尝试",
                        data: []
                    });
                }
                if (doc) {
                    return res.json({
                        code: 0,
                        msg: "系统删除成功",
                        data: doc
                    });
                }
            })
        }

    })
});
router.post('/updatestaff', (req, res) => {
    let {sid, data} = req.body;
    let obj = JSON.parse(data);
    Staffs.count({_id: sid}, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: '系统错误'
            });
        }
        if (num === 0) {
            return res.json({
                code: 1,
                msg: '没找到账户的信息'
            });
        } else {
            Staffs.update({_id: sid}, obj, function (err, doc) {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误",
                        data: err
                    });
                }
                if (doc) {
                    return res.json({
                        code: 0,
                        msg: "修改成功",
                        data: doc
                    })
                }
            })
        }
    })
});

// 删除 修改 项目
router.post('/delxms', (req, res) => {
    let {id} = req.body;
    Gcxms.count({_id: id}, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: "系统错误 稍后再尝试"
            });
        }

        if (num === 0) {
            return res.json({
                code: 1,
                msg: "你删除的账户管理不存在"
            });
        }

        if (num >= 1) {
            Gcxms.remove({_id: id}, (err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误 稍后再尝试",
                        data: []
                    });
                }
                if (doc) {
                    return res.json({
                        code: 0,
                        msg: "系统删除成功",
                        data: doc
                    });
                }
            })
        }

    })
});
router.post('/updatexms', (req, res) => {
    let {sid, data} = req.body;
    let obj = JSON.parse(data);
    Gcxms.count({_id: sid}, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: '系统错误'
            });
        }
        if (num === 0) {
            return res.json({
                code: 1,
                msg: '没找到账户的信息'
            });
        } else {
            Gcxms.update({_id: sid}, obj, function (err, doc) {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误",
                        data: err
                    });
                }
                if (doc) {
                    return res.json({
                        code: 0,
                        msg: "修改成功",
                        data: doc
                    })
                }
            })
        }
    })
});

// 删除 修改 用户
router.post('/delusers', (req, res) => {
    let {id} = req.body;
    Users.count({_id: id}, (err, num) => {
        if (err) {
            return res.json({
                code: 1,
                msg: "系统错误 稍后再尝试"
            });
        }

        if (num === 0) {
            return res.json({
                code: 1,
                msg: "你删除的账户管理不存在"
            });
        }

        if (num >= 1) {
            Users.remove({_id: id}, (err, doc) => {
                if (err) {
                    return res.json({
                        code: 1,
                        msg: "系统错误 稍后再尝试",
                        data: []
                    });
                }
                if (doc) {
                    return res.json({
                        code: 0,
                        msg: "系统删除成功",
                        data: doc
                    });
                }
            })
        }

    })
});
router.post('/updateusers', (req, res) => {
    let {name, zsname, defaultyhk, defaultxm, dengji, sid} = req.body;
    let quanxian = req.body.quanxian.split(' ');
    quanxian.splice(quanxian.length - 1, 1); // 删掉最后一项空格
    let ip = req.ip;  // 注册ip
    let time = new Date().getTime();  // 注册时间
    let kkk = [];
    for (let m = 0; m < quanxian.length; m++) {
        let obj1 = {
            name: quanxian[m],
            list: {
                read: 0,    // 0表示具有权限 增删改 浏览 权限
                update: 0,
                create: 0,
                delete: 0
            }
        };
        kkk.push(obj1);
    }
    // console.log(kkk);
    let obj = {
        name: name, // 用户名
        zsname: zsname, //真实姓名
        defaultyhk: defaultyhk, //默认资金账户
        defaultxm: defaultxm, // 默认项目
        dengji: dengji, // 级别  系统管理  普通记账 经理记账
        quanxian: kkk // 权限数组
    };
    Users.update({_id: sid}, obj, (err, doc) => {
        if (err) {
            return res.json({
                code: 1,
                msg: "系统错误 修改失败" + err
            });
        } else {
            return res.json({
                code: 0,
                msg: "添加成功",
                data: doc
            });
        }
    });
});

module.exports = router;