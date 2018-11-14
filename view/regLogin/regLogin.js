$("#phone").blur(function(){
	var phone=$(this).val();
	var reg=/^1[3456789]\d{9}$/;
	var f=reg.test(phone);
	console.log("f:",f);
	if(f){
		$("#send").prop("disabled",false);
	}else{
		$("#prompt").html("输入手机号有误!");
	}
})

$("#send").click(function(){
	$(this).prop("disabled",true);
	$("#verCode").val("");
	var i=11;
	var t=setInterval(function(){
		$("#send").html((--i)+"秒后重新发送");
		if(i<=0){
			$("#send").prop("disabled",false);
			$("#send").html("发送验证码");
			clearInterval(t);
		}
	},1000);
	$("#ver").show();
	$.post("/verPost",{phone:$("#phone").val()},function(obj){
		console.log("obj:",obj);
	})
});

$("#login").click(function(){
	var phone=$("#phone").val();
	var code=$("#verCode").val();
	if(phone&&code){
		$.post("/verCodePost",{phone:phone,code:code},function(obj){
			console.log("obj:",obj);
			if(obj.loginFlag==0){
				//sessionStorage
				sessionStorage.loginFlag=!obj.loginFlag;
				sessionStorage.phone=phone;
				
				//cookie
				var exdays=1*6000;
				var time=new Date().getTime()+exdays;
				var expTime=new Date(time);
				document.cookie="loginFlag="+!obj.loginFlag+";expires="+expTime+";path=/";
				
				location.href="/user#phone="+phone;
			}else{
				$("#prompt").html("输入手机号或验证码有误!");
			}
		})
	}else{
		$("#prompt").html("输入手机号或验证码有误!");
	}
});

console.log("sessionStorage.loginFlag:",sessionStorage.loginFlag);
