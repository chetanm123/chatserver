var http = require('http');
var url = require('url');
var items =[];
var start = new Date();
var server  = http.createServer(function(req,res){
	console.log(req.method);
	switch(req.method){
		case 'POST':
			// POST curl command--> curl -d "buy node in action" http://localhost:3000
			var item='';
			req.setEncoding('utf8');
			req.on('data',function(chunk){
				item +=chunk;
			});
			req.on('end',function(){
				items.push(item);
				res.end("OK\n");
			});
			break;
		case 'GET':
			//GET curl command--> curl http://localhost:3000
			
			/*items.forEach(function(item,i){
				res.write(i+')'+item+'\n');
			});*/
			var body = items.map(function(item, i){
				return i + ') ' + item;
				}).join('\n');
			res.setHeader('Content-Length', Buffer.byteLength(body));
			res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
			res.end(body);
			console.log('Request took:', new Date() - start, 'ms');
			
			break;
		case "PUT":
			req.on("data",function(chunk){
				var path=url.parse(req.url).pathname;
				var i =	parseInt(path.slice(1),10);
				items[i]=chunk;
				
			});
			req.on('end',function(){
				var body = items.map(function(item, i){
				return i + ') ' + item;
				}).join('\n');
				res.setHeader('Content-Length', Buffer.byteLength(body));
				res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
				res.end(body);
			});
			break;
		case 'DELETE':
			var path=url.parse(req.url).pathname;
			var i =	parseInt(path.slice(1),10);
			if(isNaN(i)){
				res.statusCode = 400;
				res.end('Invalid item id');
			}else if(!items[i]){
				res.statusCode=404;
				res.end('Item not found');
			}else{
				items.splice(i,1);
				res.end('OK\n');
			}
	}
});
server.listen(3000);