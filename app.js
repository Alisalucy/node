// app.js 模块职责： 负责启动服务
// 1.加载模块
var  express = require('express');
var config = require('./config');
var router = require('./Router.js')
// 2.创建app对象
var app = express();


// 3.注册路由
// 设置app与router相关联
// app.use('/',router);
// 简写， 根路径可以省略
app.use(router);

// 4.启动服务
app.listen(config.port,function(){
    console.log('http://localhost:'+config.port)
})