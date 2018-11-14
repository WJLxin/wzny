var page="view/regLogin/regLogin.html";
var bodyParser=require("body-parser");
var postparse=bodyParser.urlencoded({extended:false});//1
var reg=require("../apps/regLogin");

var cName="verCode";
var cName2="user";
var delTime=10000;
module.exports=function(app,dirname){
	//1.regLogin提供页面
	app.get("/regLogin",function(req,res){
		res.sendFile(dirname+"/"+page);
	});
	//2.verPost提交验证码
	app.post("/verPost",postparse,reg.verPost)
	//3.verCodePost匹配前台发过来的验证码
	app.post("/verCodePost",postparse,reg.verCodePost);
}
