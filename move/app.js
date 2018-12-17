const cheerio=require("cheerio");
const http=require("http");
const arr=[]
const url="http://www.tadu.com";
http.createServer((req,response)=>{
	response.writeHead(200,{
		"content-type":"text/html;charset=utf-8",
		"Access-Control-Allow-Origin":"*"
	})
	if(req.method.toLowerCase()=="get"){
		if (req.url=="/getdata") {
			http.get(url,function(res){
			res.setEncoding("utf-8");
			let html="";
			res.on("data",function(data){
				html+=data;
			})
			res.on("end",function(){
				let $=cheerio.load(html);
				$(".rt ul").children().each(function(index,item){
					arr.push({title:$(this).find("h2").text(),
					img:$(this).find("img").attr("data-src")
					})
				})
		        response.end(JSON.stringify(arr))
			})
		})
		}
		
	}
}).listen(8080,function(){
	console.log("服务已开启")
})