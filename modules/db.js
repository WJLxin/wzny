var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var dbUrl = "mongodb://localhost:27017";
var dbName="mydb1807";


//版本1
/*module.exports.insertOne = function(obj,cName,res) {
	MongoClient.connect(dbUrl, {useNewUrlParser: true}, function(err, db) {
		if(err) {
			console.log("连接数据库失败", err);
			res.send({error:1});
			db.close();
		} else {
			console.log("数据库连接成功");
			var dbase = db.db(dbName); //数据库名
			obj.time=new Date().getTime()+"";
			dbase.collection(cName).insertOne(obj, function(err, result) {
				if(err) {
					console.log("数据添加到mongodb失败");
					res.send({error:2});
				} else {
					console.log("数据添加到mongodb成功", result.result);
					res.send(result.result);
					db.close();
				}
			})
		}
	})
}*/

//连接数据
function connectMGDB(cb0,res){
	MongoClient.connect(dbUrl,{useNewUrlParser: true},function(err,db){
		if(err){
			console.log("连接数据库失败", err);
			res.send({error:1});
		}else{
			console.log("数据库连接成功");
			var dbase = db.db(dbName); //数据库名
			
			//回调函数(接下来要做什么?)
			cb0(dbase,db);
		}
	})
}

//第2个版本
/*module.exports.insertOne=function(cName,obj,res){
	connectMGDB(function(dbase,db){
		obj.time=new Date().getTime()+"";
		dbase.collection(cName).insertOne(obj, function(err, result) {
			if(err) {
				console.log("数据添加到mongodb失败");
				res.send({error:2});
			} else {
				console.log("数据添加到mongodb成功", result.result);
				res.send(result.result);
				db.close();
			}
		})
	},res);
}*/
//最终版本
module.exports.insertOne=function(cName,obj,res,cb){
	connectMGDB(function(dbase,db){
		dbase.collection(cName).insertOne(obj, function(err, result) {
			cb(err,result,db)
		})
	},res);
}

module.exports.find=function(cName,whereObj,res,cb){
	connectMGDB(function(dbase,db){
		whereObj.find ? whereObj.find : whereObj.find={};
		whereObj.sort ? whereObj.sort : whereObj.sort={};
		whereObj.limit ? whereObj.limit : whereObj.limit=0;
		whereObj.skip ? whereObj.skip : whereObj.skip=0;
		dbase.collection(cName).find(whereObj.find).sort(whereObj.sort).limit(whereObj.limit).skip(whereObj.skip)
		.toArray(function(err,result){
			cb(err,result,db);
		});
	},res);
}

module.exports.deleteById=function(cName,obj,res,cb){
	var whereObj={
		_id:mongodb.ObjectId(obj.id)
	}
	connectMGDB(function(dbase,db){
		dbase.collection(cName).deleteOne(whereObj, function(err, result) {
			cb(err,result,db)
		})
	},res);
}
module.exports.deleteOne=function(cName,whereObj,res,cb){
	connectMGDB(function(dbase,db){
		dbase.collection(cName).deleteOne(whereObj, function(err, result) {
			cb(err,result,db)
		})
	},res);
}

module.exports.updateOne=function(cName,whereObj,updateStr,res,cb){
	updateObj={
		$set:updateStr
	}
	connectMGDB(function(dbase,db){
		dbase.collection(cName).updateOne(whereObj,updateObj, function(err, result) {
			cb(err,result,db)
		})
	},res);
}