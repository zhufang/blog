var express = require('express');
var Article=require('../db').Article;
var auth=require('../auth');
var router = express.Router();
//发表文章
router.get('/add',auth.checkLogin,function(req,res){
    res.render('article/add',{title:'发表文章',article:{}});
});
//发表文章的路由
router.post('/add',auth.checkLogin,function(req,res){
    var article=req.body;//得到请求头对象
    //从当前登录的用户的session中获得user的_id;
    article.user=req.session.user._id;
    Article.create(article,function (err,doc) {
        if(err){
            req.session.error=err;
            res.redirect('back');
        }else{
            req.session.success='发表文章成功';
            res.redirect('/');
        }
    })

});

router.get('/detail/:_id',function (req,res) {
    var _id=req.params._id;//从路径参数对象中获取_id
    Article.findById(_id,function (err,article) {
        res.render('article/detail',{title:'文章详情',article});
    })
});
router.get('/delete/:_id',auth.checkLogin,function (req,res) {
    var _id=req.params._id;
    Article.remove({_id},function (err,doc) {
        if(err){
            req.session.error=error;
            res.redirect('back');
        }else{
            req.session.success='删除成功';
            res.redirect('/');
        }
    })
});
router.get('/update/:_id',auth.checkLogin,function (req,res) {
    var _id=req.params._id;
    Article.findById(_id,function (err,article) {
        res.render('article/add',{title:'修改文章',article});
    })
});
//保存修改
router.post('/update/:_id',auth.checkLogin,function (req,res) {
    Article.update({_id:req.params._id},req.body,function (err,article) {
        if(err){
            req.session.error=error;
            res.redirect('back');
        }else{
            req.session.success='文章修改成功';
            res.redirect('/article/detail/'+req.params._id);
            // res.redirect('/');
        }
    });
});
module.exports = router;