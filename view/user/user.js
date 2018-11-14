$(function(){
	//console.log("location:",location);
	console.log("sessionStorage.loginFlag:",sessionStorage.loginFlag);
	console.log("document.cookie",document.cookie);
	var loginFlag=sessionStorage.loginFlag;
	var phone=sessionStorage.phone;
	if(loginFlag){
		//var hash=location.hash;
		//console.log("hash:",hash);
		$("#user").html(phone);
		$("#phone").val(phone);
	}else{
		//location.href="/user#phone="+phone;
		location.href="/user";
	}
})

getData();
function getData(whereObj){
	whereObj?whereObj:whereObj={};
	/*$.post("/getDataPost",whereObj,function(data){
		console.log("data:",data);
		show(data);
	})*/
	$.ajax({
		url:"/getDataPost",
		type:"post",
		data:whereObj,
		beforeSend:function(){
			$("#loading").show();
		},
		success:function(data){
			show(data);
		},
		error:function(err){
			console.log("err:",err);
		},
		complete:function(){
			$("#loading").hide();
		}
	})
}


$("#save").click(function(){
	var phone=$("#phone").val();
	var file=$("#file")[0].files[0];
	var sex=$("#sex input:first").prop("checked")?"0":"1";
	var hobby=getHobby();
	var se=$("#se").val();
	if(phone){
		var data=new FormData();
		data.append("phone",phone);
		data.append("myFile",file);
		data.append("sex",sex);
		data.append("hobby",hobby);
		data.append("se",se);
		$.ajax({
			data:data,
			url:"/upload",
			type:"post",
			contentType:false,//不能少
			processData:false,//不能少
			success:function(obj){
				console.log("obj:",obj);
				if(obj.msg==0){
					getData();
				}
			},
			error:function(err){
				console.log("err:",err);
			}
		})
	}
});


function getHobby(){
	var hobby=[];
	var ipts=document.querySelectorAll("#hobby input");
	console.log("ipts:",ipts);
	for(var i=0;i<ipts.length;i++){
		if(ipts[i].checked){
			hobby.push(ipts[i].value);
		}
	}
	//console.log("hobby:",hobby);
	return hobby;
}

function show(arr){
	var str="";
	for(var i=0;i<arr.length;i++){
		str+=`
			<tr>
				<td>
					<img src="/${arr[i].time+"_"+arr[i].name}"  />
				</td>
				<td>
					${arr[i].phone}
				</td>
				<td>
					${arr[i].sex/1?"女":"男"}
				</td>
				<td>
					${setHooby(arr[i].hobby)}
				</td>
				<td>
					${setJob(arr[i].se)}
				</td>
				<td>
					${setTime(arr[i].time)}
				</td>
				<td>
					<a onclick=del(${JSON.stringify(arr[i])})>删除</a>
					<a onclick=upd(${JSON.stringify(arr[i])})>修改</a>
				</td>
			</tr>
		`;
	}
	$("#tabb").html(str);
}

function setHooby(str){
	if (str=="") {
		return ""
	}
	console.log("str1:",str);
	var arr=str.split(",");
	//console.log("arr:",arr);
	var obj={
		h1:"学习",
		h2:"唱歌",
		h3:"跳舞",
		h4:"数钱",
		h5:"工作"
	}
	var r="";
	for(var i=0;i<arr.length;i++){
		console.log("arr[i]:",arr[i]);
		r+=obj[arr[i]]+" ";
	}
	return r;
}
function setJob(str){
	var obj={
		j1:"百度",
		j2:"阿里",
		j3:"腾讯",
		j4:"华为"
	}
	return obj[str];
}
function setTime(str){
	//console.log("str3:",str);
	var d=new Date(str/1);
	return d.toLocaleString();
}

function del(obj){
	console.log("id:",obj._id);
	$.post("/delData",{id:obj._id,time:obj.time,name:obj.name},function(obj){
		console.log("obj:",obj);
		if(obj.msg==0){
			getData();
		}
	})
}
function upd(obj){
	$("#save").hide();
	$("#btn").show();
	$("#btn").click(function(){
	$("#save").show();
	$("#btn").hide();
		
	var phone=$("#phone").val();
	var file=$("#file")[0].files[0];
	var sex=$("#sex input:first").prop("checked")?"0":"1";
	var hobby=getHobby();
	var se=$("#se").val();
	if(phone){
		var data=new FormData();
		data.append("phone",phone);
		data.append("myFile",file);
		data.append("sex",sex);
		data.append("hobby",hobby);
		data.append("se",se);
		data.append("time",obj.time);
		$.ajax({
			data:data,
			url:"/postupd",
			type:"post",
			contentType:false,//不能少
			processData:false,//不能少
			success:function(obj){
				console.log("obj:",obj);
				if(obj.msg==0){
					getData();
				}
			},
			error:function(err){
				console.log("err:",err);
			}
		})
	}
	})

}
