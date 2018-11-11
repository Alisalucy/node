// 配置模块  配置文件的路径

var path = require('path');


module.exports = {
    'port': 9080, // 端口
    'datapath': path.join(__dirname, 'data', 'data.json'), // json数据路径
    'viewpath': path.join(__dirname, 'views')// 视图路径
}