//  处理业务逻辑模块

// 因业务逻辑这里有多个模块，所以使用对象的方式暴露模块
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');


// 1.处理首页模块
module.exports.index = function (req, res) {
    
    // 1.读取新闻数据，并将其转换为list数组
    readNewsData(function (list_news) {
        //  2.读取到的新闻数据
        // 3.在服务器端使用模板,将list与模板数据相结合，渲染给客户端
        res.rander(path.join(config.viewpath, 'index.html'), { list: list_news });
    });
}

// 2.处理submit提交模块
module.exports.submit = function (req, res) {
    res.rander(path.join(config.viewpath, 'submit.html'))
}

// 3.处理新闻详情页模块item
module.exports.item = function (req, res) {
    // 1.获取当前用户请求的新闻的id
    readNewsData(function (list_news) {
        //  2.读取到的新闻数据
        // 3.在服务器端使用模板,将list与模板数据相结合，渲染给客户端
        //  2.读取到的新闻数据
        var model = null;
        // 循环list-news中的数据，找到与id值相等的数据
        for (var i = 0; i < list_news.length; i++) {
            // 判断集合中是否有与用户提交的id相等的新闻
            if (list_news[i].id.toString() === req.query.id) {
                // 若是找到了相等的新闻，则将其记录起来

                model = list_news[i];
                break;
            }
        }
        if (model) {
            // 3.在服务器端使用模板,将list与模板数据相结合，渲染给客户端
            res.rander(path.join(config.viewpath, 'details.html'), { item: model });
        } else {
            res.end('no such item');
        }
    });

    // 2.读取 data.json 文件中的数据，根据id找到对应的id
    // 3.调用 res.render()进行模板引擎的渲染
}

// 4.处理get提交的数据
module.exports.addGet = function (req, res) {
    readNewsData(function (list) {
        req.query.id = list.length;
        list.push(req.query);
        // 把list写入文件中data.json    

        writeNewsData(list, function () {
            res.statusCode = '302';
            res.statusMessage = 'Found';
            res.setHeader('Location', '/');
            res.end();
        });

    });
}

// 5.处理post提交的数据 
module.exports.addPost = function (req, res) {
    // post方法提交一条新闻

    // 1.读取data.json文件中的数据

    readNewsData(function (list) {
        // 2.获取post提交的数据,并把它push到list里
        postData(req, function (postBody) {
            postBody.id = list.length;
            list.push(postBody);

            // 3.把list写入文件中data.json
            writeNewsData(list, function () {
                // 4.当用户点击submit后，页面自动跳转至index页
                // 手动设置跳转一次 也称为重定向
                //   通过设置响应的报文头，来跳转页面   
                res.statusCode = '302';
                res.statusMessage = 'Found';
                res.setHeader('Location', '/');

                res.end();
            })
        })

    })

}

// 6.处理静态资源
module.exports.static = function (req, res) {
    res.rander(path.join(__dirname, req.url))
}

// 7.其它情况下显示给用户的信息
module.exports.else = function (res) {
    res.writeHead(404, 'not found',
        {
            'Content-Type': 'text/html'
        });
    res.end('404 not page');
}



// 封装获取data.json的方法
function readNewsData(callback) {// 传入一个回调函数接受参数
    fs.readFile(config.datapath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') { // 因为第一次打开页面没有数据，所以需要添加个判断，当错误不等于找不到文件时，也是继续执行后续代码

            throw err;
        }
        //  2.读取到的新闻数据
        var list_news = JSON.parse(data || '[]');
        callback(list_news); //list-news是实参
    });

}

// 封装写入data.json的方法
function writeNewsData(data, callback) {
    fs.writeFile(config.datapath, JSON.stringify(data), 'utf8', function (err) {
        if (err) {
            throw err;
        }
    })
    // 3.当用户点击submit后，页面自动跳转至index页
    // 手动设置跳转一次 也称为重定向
    //    通过设置响应的报文头，来跳转页面
    callback();
}

// 封装post提交的数据
function postData(req, callback) {
    var array = [];
    req.on('data', function (chunk) {
        // 此处的chunk参数,就是浏览器提交过来的一部分数据
        // chunk 的数据类型是 buffer chunk是buffer的一个对象
        array.push(chunk);
    })

    // 监听data end事件
    // 当end事件被触发的时候，表示浏览器上所有的数据都提交过来了
    req.on('end', function () {
        // 在这个事件中只要把array中的所有数据合在一起就好了
        // 把array中的每个buffer对象集合起来，转换为一个buffer对象
        var postBody = Buffer.concat(array);
        // 把获取到的buffer对象转换成一个对象
        postBody = postBody.toString('utf8');
        //console.log(postBody); 
        //title=0000&url=http%3A%2F%2Flocalhost%3A9080%2Fsubmit&text=222
        // 把post请求的查询字符串转换成一个对象
        postBody = querystring.parse(postBody);
        callback(postBody); // 把postBody传递出去
    })
}