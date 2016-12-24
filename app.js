var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore=require('connect-mongo')(session);
var app = express();
//如果访问的是静态文件，那么则不需要解析请求体
app.use(express.static(path.resolve('public')));
app.use(express.static(path.resolve('node_modules')));
//处理查询字符串格式的请求体，处理完成后会，会把这个字符串转成对象放在req.body上
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//使用session中间件 req.session.user;
app.use(session({
    resave:true,
    saveUninitialized:true,
    secret:'zfpx',
    //session中间件非常灵活，可以把session数据放在指定的位置，默认是放在服务端内存里，但也可以放在mongodb数据里
    store:new MongoStore({
        url:'mongodb://127.0.0.1/201610blog'
    })
}));
// res.locals是真正渲染模板的对象，在render里的那个渲染的时候也会先把属性和值都拷贝到此对象上，再用这个对象来进行渲染模板
app.use(function(req,res,next){
    res.locals.error =  req.session.error;
    //清空原来的req.session中的值
    req.session.error = null;
    res.locals.success =  req.session.success;
    //清空原来的req.session中的值
    req.session.success = null;
    //把会话对象中的user取出来赋给了locals.user属性
    res.locals.user = req.session.user;
    next();
});
//指定模板引擎，指定自动添加的后缀
app.set('view engine','html');
//指定模板的存放目录，模板根目录
app.set('views',path.resolve('views'));
//指定对于.html后缀的模块用ejs方法来进行渲染
app.engine('.html',require('ejs').__express);
var index = require('./routes/index');
var user = require('./routes/user');
var article = require('./routes/article');
//当路径是以/user开头的话，会交由路由中间件来处理
app.use('/',index);
app.use('/user',user);
app.use('/article',article);
app.listen(8080,function () {
    console.log('ok');
});