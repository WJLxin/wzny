module.exports=function(app,dirname){
	require("./regLogin")(app,dirname);	//注册页面
	require("./user")(app,dirname);	//注册页面
}
