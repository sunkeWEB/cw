(function ($) {
    'use strict';
    /**
     * ajax封装
     * url 发送请求的地址
     * data 发送到服务器的数据
     * async 默认值: true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。
     *       注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
     * type 请求方式("POST" 或 "GET")， 默认为 "GET"
     * dataType 预期服务器返回的数据类型，json
     * successfn 成功回调函数
     * errorfn 失败回调函数
     */
    $.sendAjax= function (url,type, data, async, dataType, successfn, errorfn){
        async = (async==null || async=="" || typeof(async)=="undefined")? "false" : async;
        type = (type==null || type=="" || typeof(type)=="undefined")? "post" : type;
        dataType = (dataType==null || dataType=="" || typeof(dataType)=="undefined")? "json" : dataType;
        data = (data==null || data=="" || typeof(data)=="undefined")? {"date": new Date().getTime()} : data;
        var result={};
        $.ajax({
            type: type,
            async: 'true',
            data: data,
            url: url,
            dataType: dataType,
            success: function(d){
                result = d;
                console.log(result);
            },
            error: function(e){
                errorfn(e);
            }
        });
        return result;
    }
})(jQuery);