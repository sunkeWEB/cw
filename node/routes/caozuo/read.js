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
let SS = require('./mmmmm');
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

    // let num = async function () {
    //     let data;
    //      return await Srzcs.aggregate([{$match: {$and: [{time: {$lte: 1513612800}}, {time: {$gt: 1483200000}}]}}, {
    //         $group: {
    //             _id: '$type',
    //             total: {
    //                 $sum: '$price'
    //             }
    //         }
    //     }], (err, num) => {
    //         // return num;
    //          data = num;
    //          return data;
    //     });
    // };
    // let total;
    // num().then(res => {
    //     console.log(res);
    //     total = res;
    // });
    // console.log(total);
    // res.json({
    //     code: 0,
    //     msg: "success",
    //     data: mmm
    // });
    let year = 2017;
    let yearStar = 1483200000;
    let endTime, startTime = 0;
    let arr = [];
    let mmm = [];

    for (let i = 1; i <= 12; i++) {
        startTime = startTime === 0 ? yearStar : startTime;
        if (i % 2 !== 0) {
            endTime = 86400 * 31 + startTime;
        } else {
            if (i === 2) {
                // 判断是否是润年
                if ((year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)) {
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


    for (let a = 0; a < arr.length; a++) {
        SS.aggregate([{$match: {$and: [{time: {$lte: arr[a][1]}}, {time: {$gt: arr[a][0]}}]}}, {
            $group: {
                _id: '$type',
                total: {$sum: '$price'}
            }
        }], (err, num1) => {
            console.log("sdada" + num1);
            return num1;
        });
    }


    // SS(arr[0][1],arr[0][0]).then(res=>{
    //     console.log(res);
    // })

});
module.exports = router;