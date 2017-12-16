var express = require('express');
var router = express.Router();
let Mock = require('mockjs');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({
        code:1
    });
});

//  支出  api
// code: 0, // 0成功  1失败
//     data: {
//     cooperative:[ //生意伙伴
//         // name->姓名  phone->电话  cz->传真  email->邮件  adders->地址  bz->备注(大客户 小客户)
//         {id:73,name:"王小姐",phone:'',cz:'',email:'',adders:'',bz:''},
//         {id:76,name:"先启科技",phone:'',cz:'',email:'',adders:'',bz:''},
//         {id:78,name:"李波",phone:'',cz:'',email:'',adders:'',bz:''}
//     ],
//         Business: [  // 业务项目
//         //name 项目的名称
//         {name: "恒大幼儿园项目"},
//         {name: "太原铁路局标段"}
//     ]
// }

router.get('/zcapi', (req, res) => {
    return res.json(Mock.mock({
        code: 0, // 0成功  1失败
        data: {
            "cooperative|3":[
                {"id|+1":1,"name":"@cname()","phone":13639018324,"cz":10851235687,email:'@email()',adders:'贵州贵阳市',"bz|1":["大客服","散户","小客户"]},
            ],
            business: [  // 业务项目
                //name 项目的名称
                {id:1,name: "恒大幼儿园项目"},
                {id:2,name: "太原铁路局标段"}
            ]
        }
    }));
});


module.exports = router;
