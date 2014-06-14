var events = require('events'),
	net = require('net');

var channel = new events.EventEmitter();
channel.clients={};
channel.subscriptions={};

channel.on('join',function(id,client){
	console.log('Here when client connects and emits join event :'+ id+" "+client);
	var welcome = "Welcome!\n"+'Guest Online: '+this.listeners('broadcast').length;
	client.write(welcome+"\n");
	this.clients[id]=client;
	this.subscriptions[id]=function(senderId,message){
		console.log('sender Id '+senderId+"  Message"+message);
		if(id!=senderId){
			this.clients[id].write(message);
		}
	}
	this.on('broadcast',this.subscriptions[id]);
});

channel.on('leave',function(id){
	channel.removeListener(
		'broadcast',this.subscriptions[id]);
	console.log(id +" left chat");
	channel.emit('broadcast',id, id+" has left the chat.\n");
});

var server = net.createServer(function(client){
	var id = client.remoteAddress+":"+client.remotePort;
	client.on('connect',function(){
		console.log('here when connects');
		channel.emit('join',id,client);
	});
	client.on('data',function(data){
		console.log('here when received data');
		data = data.toString();
		channel.emit('broadcast',id,data);
	});

	client.on('close',function(){
		channel.emit('leave',id);
	});
});
server.listen(8888);