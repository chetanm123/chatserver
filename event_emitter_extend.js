var fs=require('fs')
,watchDir = './watch'
,processDir ='./done';

var events = require('events')
,util = require('util');
util.inherits(Watcher,events.EventEmitter);

function Watcher(watchDir, processedDir) {
this.watchDir = watchDir;
this.processedDir = processedDir;
}

Watcher.prototype.watch=function(){ //Extend EventEmitter with method that processes files

	var watcher=this; //Store reference to Watcher object for use in readdir callback
	fs.readdir(this.watchDir,function(err,files){
		if(err)throw err;
		for(var index in files){
			watcher.emit('process',files[index]);//Process each file in the watch directory
		}
	})
}

Watcher.prototype.start=function(){ //Extend EventEmitter with method to start watching
	var watcher=this;
	
	fs.watchFile(watchDir,function(){
		console.log('Somethings happening ');
		watcher.watch();
	});
}


var watcher = new Watcher(watchDir,processDir);

watcher.on('process',function process(file){
	var watchFile = this.watchDir+'/'+file;
	var processedFile = this.processedDir+'/'+file.toLowerCase();

	fs.rename(watchFile,processedFile,function(err){
			if(err)throw err;
		});
	
});
watcher.start();
