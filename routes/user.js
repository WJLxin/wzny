var user=require("../apps/user");
var multer =require("multer");
var bodyParser=require("body-parser");
var postparse=bodyParser.urlencoded({extended:false});//1

module.exports=function(app){
	app.use(multer({dest:"/tmp/"}).array("myFile"));
	app.get("/user",user.user);
	app.post("/upload",user.upload);
	app.post("/getDataPost",postparse,user.getDataPost);
	app.post("/delData",postparse,user.delData);
	app.post("/postupd",postparse,user.postupd);
}
