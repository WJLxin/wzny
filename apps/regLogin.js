var db = require("../modules/db");
var cName = "verCode";
var cName2 = "user";
var delTime = 10000;
////2.verPost提交验证码
module.exports.verPost = function(req, res) {
	var obj = req.body;
	console.log("verPost obj:", obj);
	//模拟第三方短信平台
	var code = "";
	for(var i = 0; i < 4; i++) {
		code += parseInt(Math.random() * 10);
	}
	obj.code = code;
	obj.time = new Date().getTime() + "";
	db.insertOne(cName, obj, res, function(err, result, db) {
		if(err) {
			console.log("数据添加失败");
			res.send({
				error: 2
			});
		} else {
			console.log("数据添加成功", result.result);
			//res.send(result.result);
			res.send({
				code: code
			});
			db.close();
		}
	});
	var whereObj = {};
	whereObj.find = {
		phone: obj.phone
	}
	db.find(cName2, whereObj, res, function(err, result, db2) {
		if(err) {
			console.log("数据查询失败");
		} else {
			console.log("数据查询成功", result);
			var arr = result;
			console.log("arr:", arr);
			if(arr.length == 0) {
				db.insertOne(cName2, {
					phone: obj.phone,
					time: obj.time
				}, res, function(err, result, db) {
					if(err) {
						console.log("数据添加失败");
						//res.send({error:2});
					} else {
						console.log("数据添加成功", result.result);
						//res.send(result.result);
						//res.send({code:code});
						db2.close();
					}
				})
			}
		}
	})
	setTimeout(function() {
		db.deleteOne(cName, obj, res, function(err, result, db) {
			if(err) {
				console.log("数据删除失败");
			} else {
				console.log("数据删除成功", result.result);
				db.close();
			}
		})
	}, delTime);
}
//3.verCodePost匹配前台发过来的验证码
module.exports.verCodePost=function(req,res){
		var obj=req.body;
		var whereObj={};
		whereObj.find=obj;
		console.log("verCodePost whereObj:",whereObj);
		db.find(cName,whereObj,res,function(err,result,db){
			if(err){
				console.log("查询数据失败");
				res.send({error:3})
				db.close();
			}else{
				console.log("查询数据成功");
				//console.log("result:",result);
				db.close();
				if(result.length>0){
					res.send({loginFlag:0});
				}else{
					res.send({loginFlag:1});
				}
			}
		});
}
