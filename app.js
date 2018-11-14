var express = require("express");
var app = express();
//静态资源
app.use(express.static("./public"));
app.use(express.static("./public/upload/img"));
app.use(express.static("./public/img"));
app.use(express.static("./view"));

var router=require("./routes");

router(app,__dirname);

app.listen(82,function(){
	console.log("OK 82");
})
