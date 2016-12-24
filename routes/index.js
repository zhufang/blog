var express = require('express');
var Article=require('../db').Article;
var router = express.Router();
router.get('/',function(req,res){
    //populate 指的是填充 用于把当前对象的一个属性从对象ID转成对象类型
    Article.find({}).populate('user').exec(function (err,articles) {
        res.render('index',{title:'首页',articles});
    });

});
module.exports = router;
