let express = require('express');
let router = express.Router();
let mongoose = require('./../../database/mongooseConfig');
let DxTypes = require('./../../model/dxtype');
let readDxTypes = require('./readapi');   // 读取大类 小类 类型 函数
let readGcxms = require('./readxmapi'); // 读取 工程项目
let readKeHus = require('./readkh');  // 读取 客户 函数   注意这两个地方不一样
let readKeHu = require('./../../model/kefu');  // 读取 客户
let readSrzcs = require('./readsrcz'); // 收入支出
let Srzcs = require('./../../model/srzcs'); // 收支
let Accountzh = require('./../../model/accountguanli'); // 账户管理
let AccountTypes = require('./../../model/accountypes'); // 账号类型
let Dxtypes = require('./../../model/dxtype'); // 大小类项目
let Staffs = require('./../../model/staff'); // 员工
let Gcxms = require('./../../model/gcxm'); // 工程项目
let Users = require('./../../model/users'); // 用户
let moment = require('moment'); // 时间处理
let Ysyf = require('./../../model/ysyf');

// let SS = require('./mmmmm');
router.get('/sort', (req, res) => {
    Dxtypes.find({}).limit(2).skip(0).exec((err, doc) => {
        res.json({
            num: doc
        });
    })
});

router.get('/', (req, res) => {
    res.json({
        code: 0,
        msg: "success"
    });
});

// 收入记账 支出记账
router.get('/read', (req, res) => {
    let data = 100; // 存 大类 小类
    let xm = 100;  // 存 项目信息
    readDxTypes().then(type => {
        data = type;
        return readGcxms();
    }).then(xms => {
        xm = xms;
        return readKeHus();
    }).then(khs => {
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: data,
            xm: xm,
            kh: khs
        });
    });
});

//收支流水列表
function sersch(searchValue) {
    let obj = [
        {
            dtype: {$regex: searchValue}
        }, {
            xtype: {$regex: searchValue}
        }, {
            price: {$regex: searchValue}
        }, {
            time: {$regex: searchValue}
        }, {
            zjzh: {$regex: searchValue}
        }, {
            yshb: {$regex: searchValue}
        }, {
            ywxm: {$regex: searchValue}
        }, {
            jbr: {$regex: searchValue}
        }, {
            sm: {$regex: searchValue}
        }]; // 查询的条件
    return obj;
}

router.get('/readsrzc', (req, res) => {
    let {order, offset, limit, sort, sid} = req.query; // 获取查询条件
    let searchValue = req.query.search;
    let k = [];
    let kkk = {};
    let doc1, total = 1;
    if (sid === undefined) {
        let searchValue1 = searchValue ? k = sersch(searchValue) : k;
        if (k.length >= 1) {
            kkk = {
                '$or': k
            };
        }
        let query = Srzcs.find(kkk, (err, doc) => {
            doc1 = doc;
        });
        query.count((err, num) => {
            total = num;
        });
    } else {
        kkk = {
            _id: sid
        };
    }
    Srzcs.find(kkk).limit(parseInt(limit)).skip(parseInt(offset)).exec((err, doc) => {
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: doc,
            total: total
        });
    })
});

//账户管理列表
function serschzh(searchValue) {
    let obj = [
        {
            name: {$regex: searchValue}
        }, {
            defaultprice: {$regex: searchValue}
        }, {
            price: {$regex: searchValue}
        }, {
            status: {$regex: searchValue}
        }, {
            createtime: {$regex: searchValue}
        }, {
            sm: {$regex: searchValue}
        }]; // 查询的条件
    return obj;
}

router.get('/readaccountzh', (req, res) => {
    let {order, offset, limit, sort, sid} = req.query; // 获取查询条件  sid 如果有值 就是获取单个的数据  如果是undefined 全部数据
    let searchValue = req.query.search;
    let k = [];
    let kkk = {};
    let doc1, total = 1;

    if (sid === undefined) {
        let searchValue1 = searchValue ? k = serschzh(searchValue) : k;
        if (k.length >= 1) {
            kkk = {
                '$or': k
            };
        }
        let query = Accountzh.find(kkk, (err, doc) => {
            doc1 = doc;
        });
        query.count((err, num) => {
            total = num;
        });
    } else {
        kkk = {
            _id: sid
        };
    }
    Accountzh.find(kkk).limit(parseInt(limit)).skip(parseInt(offset)).exec((err, doc) => {
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: doc,
            total: total
        });
    });
});

//账户类型列表
function serschtype(searchValue) {
    let obj = [{
        name: {$regex: searchValue}
    }]; // 查询的条件
    return obj;
}

router.get('/readaccountype', (req, res) => {
    let {order, offset, limit, sort} = req.query; // 获取查询条件
    let searchValue = req.query.search;
    let k = [];

    let searchValue1 = searchValue ? k = serschtype(searchValue) : k;
    let kkk = {};
    if (k.length >= 1) {
        kkk = {
            '$or': k
        };
    }
    let doc1, total;
    let query = AccountTypes.find(kkk, (err, doc) => {
        doc1 = doc;
    });
    query.count((err, num) => {
        total = num;
    });
    AccountTypes.find(kkk).limit(parseInt(limit)).skip(parseInt(offset)).exec((err, doc) => {
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: doc,
            total: total
        });
    });
});

//大类项目列表
function serschdtype(searchValue) {
    let obj = [{
        name: {$regex: searchValue},
        sm: {$regex: searchValue},
        dtype: {$regex: searchValue}
    }]; // 查询的条件
    return obj;
}

router.get('/readtype', (req, res) => {
    let {order, offset, limit, sort} = req.query; // 获取查询条件
    let searchValue = req.query.search;
    if (searchValue === "支出") {
        searchValue = 0;
    } else if (searchValue === "收入") {
        searchValue = 1;
    }
    let k = [];
    let searchValue1 = searchValue ? k = serschdtype(searchValue) : k;
    let kkk = {};
    if (k.length >= 1) {
        kkk = {
            '$or': k
        };
    }
    let doc1, total;
    let query = Dxtypes.find(kkk, (err, doc) => {
        doc1 = doc;
    });
    query.count((err, num) => {
        total = num;
    });
    Dxtypes.find(kkk).limit(parseInt(limit)).skip(parseInt(offset)).exec((err, doc) => {
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: doc,
            total: total
        });
    });

});

//客户列表
function serschkefu(searchValue) {
    let obj = [{
        name: {$regex: searchValue},
        sm: {$regex: searchValue},
        dtype: {$regex: searchValue}
    }]; // 查询的条件
    return obj;
}

router.get('/readkehus', (req, res) => {
    let {order, offset, limit, sort} = req.query; // 获取查询条件
    let searchValue = req.query.search;
    if (searchValue === "正常") {
        searchValue = 0;
    } else if (searchValue === "锁定") {
        searchValue = 1;
    }
    let k = [];
    let searchValue1 = searchValue ? k = serschkefu(searchValue) : k;
    let kkk = {};
    if (k.length >= 1) {
        kkk = {
            '$or': k
        };
    }
    let doc1, total;
    let query = readKeHu.find(kkk, (err, doc) => {
        doc1 = doc;
    });
    query.count((err, num) => {
        total = num;
    });
    readKeHu.find(kkk).limit(parseInt(limit)).skip(parseInt(offset)).exec((err, doc) => {
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: doc,
            total: total
        });
    });

});

// 员工列表
function serschyuangong(searchValue) {
    let obj = [{
        name: {$regex: searchValue},
        sm: {$regex: searchValue},
        dtype: {$regex: searchValue},
        status: {$regex: searchValue},
    }]; // 查询的条件
    return obj;
}

router.get('/readyuangong', (req, res) => {
    let {order, offset, limit, sort} = req.query; // 获取查询条件
    let searchValue = req.query.search;
    let k = [];
    if (searchValue === "正常") {
        searchValue = 0;
    } else if (searchValue === "锁定") {
        searchValue = 1;
    }
    let searchValue1 = searchValue ? k = serschyuangong(searchValue) : k;
    let kkk = {};
    if (k.length >= 1) {
        kkk = {
            '$or': k
        };
    }
    let doc1, total;
    let query = Staffs.find(kkk, (err, doc) => {
        doc1 = doc;
    });
    query.count((err, num) => {
        total = num;
    });
    Staffs.find(kkk).limit(parseInt(limit)).skip(parseInt(offset)).exec((err, doc) => {
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: doc,
            total: total
        });
    });

});

//项目管理列表
function serschxm(searchValue) {
    let obj = [{
        name: {$regex: searchValue},
        sm: {$regex: searchValue},
        status: {$regex: searchValue},
    }]; // 查询的条件
    return obj;
}

router.get('/readxm', (req, res) => {
    let {order, offset, limit, sort} = req.query; // 获取查询条件
    let searchValue = req.query.search;
    let k = [];
    if (searchValue === "正常") {
        searchValue = 0;
    } else if (searchValue === "锁定") {
        searchValue = 1;
    }
    let searchValue1 = searchValue ? k = serschxm(searchValue) : k;
    let kkk = {};
    if (k.length >= 1) {
        kkk = {
            '$or': k
        };
    }
    let doc1, total;
    let query = Gcxms.find(kkk, (err, doc) => {
        doc1 = doc;
    });
    query.count((err, num) => {
        total = num;
    });
    Gcxms.find(kkk).limit(parseInt(limit)).skip(parseInt(offset)).exec((err, doc) => {
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: doc,
            total: total
        });
    });

});

//用户管理列表
function serschusers(searchValue) {
    let obj = [{
        name: {$regex: searchValue},
        sm: {$regex: searchValue},
        status: {$regex: searchValue},
    }]; // 查询的条件
    return obj;
}

router.get('/readusers', (req, res) => {
    let {order, offset, limit, sort, sid} = req.query; // 获取查询条件
    let searchValue = req.query.search;
    let k = [];
    let kkk = {};
    let doc1, total = 1;
    if (searchValue === "正常") {
        searchValue = 0;
    } else if (searchValue === "锁定") {
        searchValue = 1;
    }
    if (sid === undefined) {
        let searchValue1 = searchValue ? k = serschusers(searchValue) : k;
        if (k.length >= 1) {
            kkk = {
                '$or': k
            };
        }
        let query = Users.find(kkk, (err, doc) => {
            doc1 = doc;
        });
        query.count((err, num) => {
            total = num;
        });
    } else {
        kkk = {
            _id: sid
        };
    }
    Users.find(kkk).limit(parseInt(limit)).skip(parseInt(offset)).exec((err, doc) => {
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: doc,
            total: total
        });
    });

});

//应收应付
function serschysyf(searchValue) {
    let obj = [{
        name: {$regex: searchValue},
        sm: {$regex: searchValue},
        status: {$regex: searchValue},
    }]; // 查询的条件
    return obj;
}

router.get('/readysyf', (req, res) => {
    let {order, offset, limit, sort, sid} = req.query; // 获取查询条件
    let searchValue = req.query.search;
    let k = [];
    let kkk = {};
    let doc1, total = 1;
    if (searchValue === "正常") {
        searchValue = 0;
    } else if (searchValue === "锁定") {
        searchValue = 1;
    }
    if (sid === undefined) {
        let searchValue1 = searchValue ? k = serschysyf(searchValue) : k;
        if (k.length >= 1) {
            kkk = {
                '$or': k
            };
        }
        let query = Ysyf.find(kkk, (err, doc) => {
            doc1 = doc;
        });
        query.count((err, num) => {
            total = num;
        });
    } else {
        kkk = {
            _id: sid
        };
    }
    Ysyf.find(kkk).limit(parseInt(limit)).skip(parseInt(offset)).exec((err, doc) => {
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: doc,
            total: total
        });
    });
});

// 支出汇总统计图
router.get('/readsrzctjt', (req, res) => {
    Srzcs.aggregate({$group: {_id: '$type', total: {$sum: '$price'}}}, (err, doc) => {
        if (err) {
            res.json({
                code: 1,
                msg: "数据获取失败",
                err: err
            });
        } else {
            res.json({
                code: 0,
                msg: "数据获取成功",
                data: doc
            });
        }
    });
});

// 年度支出汇总统计图
router.get('/readyearzctjt', (req, res) => {
    let {years} = req.query;
    let stringTime = `${years}-01-1 00:00:00`;
    let yearStar = Date.parse(new Date(stringTime)) / 1000;
    // let yearStar = 1483200000;
    let endTime, startTime = 0;
    let arr = [];
    for (let i = 1; i <= 12; i++) {
        startTime = startTime === 0 ? yearStar : startTime;
        if (i % 2 !== 0) {
            endTime = 86400 * 31 + startTime;
        } else {
            if (i === 2) {
                // 判断是否是润年
                if ((years % 4 === 0) && (years % 100 !== 0 || years % 400 === 0)) {
                    endTime = 86400 * 29 + startTime;
                } else {
                    endTime = 86400 * 28 + startTime;
                }
            } else {
                endTime = 86400 * 30 + startTime;
            }
        }
        arr.push([startTime, endTime]);
        startTime = endTime;
    }

    let sleep = function (start, end) {
        return new Promise(function (resolve, reject) {
            Srzcs.aggregate([{$match: {$and: [{time: {$lte: start}}, {time: {$gt: end}}]}}, {
                $group: {
                    _id: '$type',
                    total: {$sum: '$price'}
                }
            }], (err, num1) => {
                resolve(num1);
            });
        })
    };
    let start = async function () {
        let result = [];
        for (let a = 0; a < 12; a++) {
            result.push(await sleep(arr[a][1], arr[a][0]));
        }
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: result
        });
    };
    start();
});

// 月统计图
router.get('/readmouthtjt', (req, res) => {
    let {year, mouth, num} = req.query;
    let sleep = function (start, end) {
        return new Promise(function (resolve, reject) {
            Srzcs.aggregate([{$match: {$and: [{time: {$lte: start}}, {time: {$gt: end}}]}}, {
                $group: {
                    _id: '$type',
                    total: {$sum: '$price'}
                }
            }], (err, num1) => {
                resolve(num1);
            });
        })
    };
    let start = async function () {
        let result = [];
        for (let a = 1; a <= num; a++) {
            let stringTime = `${year}-${mouth}-${a} 00:00:00`;
            let mouthStar = Date.parse(new Date(stringTime)) / 1000;
            let endTime = `${year}-${mouth}-${a} 23:59:59`;
            let mouthend = Date.parse(new Date(endTime)) / 1000;
            result.push(await sleep(mouthend, mouthStar));
        }
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: result
        });
    };
    start();
});

// 购表
router.get('/readsrgb', (req, res) => {
    let {type} = req.query; // 收入
    let sleep = function () {
        return new Promise(function (resolve, reject) {
            Srzcs.aggregate([{$match: {$and: [{type: parseInt(type)}]}}, {
                $group: {
                    _id: '$jzr',
                    total: {$sum: '$price'}
                }
            }], (err, num1) => {
                resolve(num1);
            });
        })
    };
    let start = async function () {
        let result = [];
        result.push(await sleep());
        res.json({
            code: 0,
            msg: "数据获取成功",
            data: result
        });
    };
    start();
});

// 读取大类
router.get('/readdalei', (req, res) => {
    let {type} = req.query;
    DxTypes.find({type: type}, {type: 0, _id: 0, sm: 0, __v: 0}, (err, doc) => {
        if (err) {
            return res.json({
                code: 1,
                msg: "读取错误大类"
            });
        } else {
            res.json({
                code: 0,
                data: doc
            });
        }
    });
});

// 读取生意伙伴
router.get('/readyshb', (req, res) => {
    readKeHu.find({}, {_id: 0, status: 0}, (err, doc) => {
        if (err) {
            return res.json({
                code: 1,
                msg: "读取生意伙伴失败"
            });
        } else {
            Gcxms.find({}, {_id: 0, __v: 0, ip: 0, status: 0, time: 0}, (err, doc1) => {
                Accountzh.find({}, {
                    __v: 0,
                    ip: 0,
                    status: 0,
                    createtime: 0,
                    zzdz: 0,
                    szdz: 0,
                    defaultprice: 0
                }, (err, doc2) => {
                    return res.json({
                        code: 0,
                        msg: "读取项目success",
                        yshb: doc,
                        gcxm: doc1,
                        yhzh: doc2
                    });
                });
            });
        }
    });
});

//读取银行账户收支流水详情
router.get('/readyhzhszls', (req, res) => {
    let {offset, limit, id} = req.query; // 获取查询条件
    Accountzh.find({_id: id}).limit(parseInt(limit)).skip(parseInt(offset)).exec((err, doc1) => {
        if (err) {
            res.json({
                code: 1,
                msg: "系统错误"
            });
        } else {
            if (doc1.length >= 1) {
                Accountzh.find({_id: id}, (err, doc) => {
                    res.json({
                        code: 0,
                        msg: "数据获取成功",
                        data: doc1[0].szdz,
                        total: doc[0].szdz.length
                    });
                });
            } else {
                return res.json({
                    code: 2,
                    msg: "没有相关的数据",
                    data: [],
                    total: 0
                });
            }
        }
    });
});

//读取银行账户转账流水详情
router.get('/readyhzzzzls', (req, res) => {
    let {offset, limit, id} = req.query; // 获取查询条件
    Accountzh.find({_id: id}).limit(parseInt(limit)).skip(parseInt(offset)).exec((err, doc1) => {
        if (err) {
            res.json({
                code: 1,
                msg: "系统错误"
            });
        } else {
            if (doc1.length >= 1) {
                Accountzh.find({_id: id}, (err, doc) => {
                    res.json({
                        code: 0,
                        msg: "数据获取成功",
                        data: doc1[0].zzdz,
                        total: doc[0].zzdz.length
                    });
                });
            } else {
                return res.json({
                    code: 2,
                    msg: "没有相关的数据",
                    data: [],
                    total: 0
                });
            }
        }
    });
});

// 读取小类
router.get('/readxtypes', (req, res) => {
    DxTypes.find({}, (err, doc) => {
        if (err) {
            return res.json({
                code: 1,
                msg: "小类获取失败"
            });
        } else {
            let data = [];
            for (item of doc) {
                if (item.sunlist.length >= 1) {
                    for (items of item.sunlist) {
                        data.push(items);
                    }
                }
            }
            return res.json({
                code: 0,
                msg: "小类获取成功",
                data: data
            });
        }
    });
});

module.exports = router;