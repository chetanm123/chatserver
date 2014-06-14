var events = require('events');
var myEmitter = new events.EventEmitter();

myEmitter.on('error',function(err){
	console.log("Error :"+err.message);
});
var cal=1+2;
myEmitter.emit('error', new Error('Oops Error'));