var http= require('http'),
	url = require('url'),
	fs = require('fs'),
	path = require('path'),
	io = require('socket.io'),
	Currency = require('./currency.js')
	;

canadianDollar = 0.91;
currency = new Currency(canadianDollar);
console.log(currency.canadianToUS(50));

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
var sock=io.listen(server);
sock.configure(function(){
	sock.set('log level',1);
});
sock.on("connection",function(socket){
	
		socket.emit('date',{"date":new Date()});

		socket.on('client_data',function(data){
			process.stdout.write(data.letter);
		});

});

