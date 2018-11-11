// 扩展模块

// 为req增加一个query属性，该属性中保存的就是用户get提交过来的数据
// 为req增加一个pathname
// 为res增加一个rander函数


var fs = require('fs');
var mime = require('mime');
var _ = require('underscore');
var url = require('url');
// 让当前模块对外暴露一个函数，通过这个函数将index.js中的req,res传递过来
module.exports = function(req,res){
   
    var objurl = url.parse(req.url.toLowerCase(),true); // 拿到的是个对象
    // 1.为req增加query属性
    req.query = objurl.query;
    // 2.为req增加pathname属性
    req.pathname = objurl.pathname;
    req.method = req.method.toLowerCase();
    // 3.为res增rander函数
    res.rander=function(filename,tplData){
        fs.readFile(filename,function(err,data){
            if(err){ 
                res.writeHead(404,'not found',{
                    'Content-Type':'text/html'});
                res.end('404 not page')
            }
    
            if(tplData){
                var fn=_.template(data.toString("utf8"));
                // 一定要把渲染后的模板重新赋值给data
                data = fn(tplData);
            };
            res.setHeader('Content-Type',mime.getType(filename))
            res.end(data)
        })
    }
}


// 步骤
// 1.思考，该模块中要封装什么代码
// 2.思考，这些代码有用到外部的数据吗  若用到了，是否需要 通过参数将这些数据传递给当前模块
// 3.当前模块对外需要暴露的东西 module.exports