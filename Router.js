// 路由模块,只负责处理路由

// 1.创建一个router对象
var express = require('express');
var router = express.router();
var handle = require('./handle');

// 2.通过router设置挂载路由
router.get('/',handle.index);
router.get('/index',handle.index);

router.get('/submit',function(req,res){
    
});
router.get('/item',function(req,res){
    
});
router.get('/add',function(req,res){
    
});
router.post('/add',function(req,res){
    
});

// 3.返回router对象
module.exports = router;