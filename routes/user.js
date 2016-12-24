var express = require('express');
//导入操作数据库的用户集合的模型
var User = require('../db').User;
var auth=require('../auth');
var multer=require('multer');
//指定我们的上传文件的存放目录，当前目录下面的public目录
var upload=multer({dest:'public/'});
//这是一个工厂函数,返回一个路由容器实例
var router = express.Router();
//注册 /user/signup
//路径一定以/开头 模板路径一定不要以/开头
/**
 * 1. 编写注册模板 用户名 密码 邮箱
 * 2. 点击提交按钮提交到后台 post /signup
 * 3. 在/signup里，接收传过来的表单数据，通过body-parser中间件来将请求体放在 req.body上。
 * 4. 引入User模型，然后把此对象保存到数据库中
 */
router.get('/signup',auth.checkNotLogin,function(req,res){
    //此相对路径是相对于views的子路径，不是相对于当前目录的
    res.render('user/signup',{title:'注册'});
});
//处理注册用户时的表单提交
//当表单中只有一个文件域的时候可以用upload.sibgle('avatar') avatar 指的是上传文件的文件域的name req.body   req.file
router.post('/signup',auth.checkNotLogin,upload.single('avatar'),function(req,res){
    //取得请求体对象
    var user = req.body;
    //把文件名存储到user的avatar '/'+表示绝对路径
    user.avatar='/'+req.file.filename;
    if(user.username && user.password){
        User.findOne({username:user.username},function(err,oldUser){
            if(err){//如果查询过程出错了，则error有值
                //把错误原因放在session对象中
                req.session.error = err;
                //back表示让客户端 重新向上一个页发请求，其实就是 /user/signup
                res.redirect('back');
            }else{
                if(oldUser){
                    req.session.error = '用户名已经被占用，大侠请改个别的名字吧,比如'+user.username+'200';
                    res.redirect('back');
                }else{
                    User.create(user,function(err,doc){
                        if(err){
                            //把错误原因放在session对象中
                            req.session.error = err;
                            //back表示让客户端 重新向上一个页发请求，其实就是 /user/signup
                            res.redirect('back');
                        }else{
                            //把保存后的对象作为req.session属性,session对象是在服务器端内存里放置
                            req.session.user = doc;
                            res.redirect('/');
                        }
                    })
                }
            }
        })
    }else{
        req.session.error = '用户和密码不能为空!';
        res.redirect('back');
    }
});
//登录
router.get('/signin',auth.checkNotLogin,function(req,res){
    res.render('user/signin',{title:'登录'});
});
router.post('/signin',auth.checkNotLogin,function(req,res){
    var user = req.body;
    User.findOne(user,function (err,doc) {
        if(err){
            req.session.error=err;
            res.redirect('back');
        }else{
            if(doc){
                req.session.user=doc;
                res.redirect('/')
            }else{
                req.session.error='用户名和密码不正确';
                res.redirect('back');
            }

        }
    })



});
//退出登录
router.get('/signout',auth.checkLogin,function(req,res){
    //把 session的user属性清空掉则意味着清除掉session
    req.session.user = null;
    res.redirect('/user/signin');
});
module.exports = router;