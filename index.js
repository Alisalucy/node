// 按照功能不同划分不同的模块
// 1.服务模块：负责启动服务
// 2.扩展模块：负责扩展req res对象，为req,res增加更丰富的api
// 3.路由模块：负责路由判断
// 4.业务模块：负责处理具体路由的业务模块
// 5.数据操作模块：负责进行数据库操作
// 6.配置模块：负责报错各种项目中用到的配置信息

// 当前项目的入口文件
var http = require('http');
var config = require('./config.js');

var context = require('./Context.js');
var router = require('./Router.js');

// 2.创建服务
http.createServer(function (req, res) {
    // 扩展模块，并把req,res当作参数传递过去
    context(req, res);
    // 路由模块  并把req,res当作参数传递过去
    router(req, res);

}).listen(config.port, function () {
    console.log('http://localhost:' + config.port)
})


