var page="/user/user.html";
var fs=require("fs");
var db=require("../modules/db");


module.exports.user=function(req,res){
	res.redirect(302,page);
}

var cName="userInfo";
//upload上传
module.exports.upload=function(req,res){
	var obj=req.body;
	var file=req.files[0];
	if(file.mimetype!="image/jpeg"){
		res.send({error:1});
		return;
	}
	var time=new Date().getTime();
	var name=file.originalname;
	var imgName=time+"_"+name;
	var desFile="./public/upload/img/"+imgName;
	var path=file.path;
	fs.readFile(path,function(err,data){
		if(err){
			console.log("读取失败",err);
			res.send({error:2});
		}else{
			fs.writeFile(desFile,data,function(err){
				if(err){
					console.log("写入失败",err);
					res.send({error:3});
				}else{
					//////
					obj.name=name;
					obj.time=time+"";
					db.insertOne(cName, obj, res, function(err, result, db) {
						if(err) {
							console.log("数据添加失败");
							res.send({
								error: 4
							});
						} else {
							var r=result.result;
							if(r.ok==1&&r.n>0){
								res.send({msg:0});								
							}else{
								res.send({msg:1});
							}
							db.close();
						}
					});
					//////
				}
			})
		}
	})
}

//getDataPost获取数据
module.exports.getDataPost=function(req,res){
	var whereObj=req.body;
	db.find(cName,whereObj,res,function(err,result,db){
		if(err) {
			console.log("查询失败");
			res.send({
				error: 5
			});
		} else {
			db.close();
			res.send(result);
		}
	})
}

//delData删除数据
module.exports.delData=function(req,res){
	var obj=req.body;
	console.log("delData obj:",obj);
	db.deleteById(cName,obj,res,function(err,result,db){
		if(err) {
			console.log("删除失败");
			res.send({
				error: 6
			});
		} else {
			console.log("删除成功", result.result);
			var r=result.result;
			if(r.ok==1&&r.n>0){
				res.send({msg:0});
				var path="./public/upload/img/"+obj.time+"_"+obj.name;
				fs.unlink(path,function(err){
					if(err){
						console.log("err:",err);
					}else{
						console.log("删除成功");
					}
				});
			}
			db.close();
		}
	})
}

module.exports.postupd=function(req,res){
	var obj=req.body;
	console.log("upload Obj",obj);
	var file=req.files[0];
	if(file.mimetype!="image/jpeg"){
		res.send({error:1});
		return;
	}
	var time=new Date().getTime();
	var name=file.originalname;
	var imgName=time+"_"+name;
	var desFile="./public/upload/img/"+imgName;
	var path=file.path;
	fs.readFile(path,function(err,data){
		if(err){
			console.log("读取失败",err);
			res.send({error:2});
		}else{
			fs.writeFile(desFile,data,function(err){
				if(err){
					console.log("写入失败",err);
					res.send({error:3});
				}else{
					//////
					var whereobj={
						time:obj.time
					};
					obj.name=name;
					obj.time=time+"";
					console.log("obj:",obj);
					db.updateOne(cName, whereobj,obj,res, function(err, result, db) {
						if(err) {
							console.log("数据添加失败");
							res.send({
								error: 4
							});
						} else {
							var r=result.result;
							if(r.ok==1&&r.n>0){
								res.send({msg:0});								
							}else{
								res.send({msg:1});
							}
							db.close();
						}
					});
					//////
				}
			})
		}
	})
}