var http= require('http'),
	url = require('url'),
	fs = require('fs'),
	path = require('path'),
	io = require('socket.io')
	;

var server = http.createServer(function(request,response){
		var path = url.parse(request.url).pathname;
		
		switch(path){
			case '/':
				response.writeHead(200,{'Content-Type':'text/html'});
				response.write('hello world');
				response.end();
				break;

			case '/socket.html':
				var filePath = "./socket.html";
				
				fs.readFile(filePath,function(error,data){
					
					if(error){
						
						response.writeHead(404);
						response.write('Page not found socket.html' );
						response.end();
					}else{
						
						response.writeHead(200,"utf8",{'Content-Type':'text/html'});
						response.write(data);
						response.end();
					}
				});
			break;

			default:
				response.writeHead(404);
				response.write('Page not found');
				break;
		}
	
});
server.listen(3150);
io.listen(server);