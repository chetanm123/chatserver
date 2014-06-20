var fs = require('fs'),
    request = require('request'),
	htmlparser = require('htmlparser');

var tasks = [                          //1
		function(){
				var configFilename='./rss_feeds.txt';
				fs.exists(configFilename,function(exists){  //2
					if(!exists){
						next('Create a list of RSS feeds in the file ./rss_feeds.txt');
					}
					else{
						next(false,configFilename);
					}
				});
			},

		function(configFilename){
			fs.readFile(configFilename,function(err,feedList){  //3
				if(err){
					next(err.message);
				}else{
					feedList = feedList.toString().replace(/^\s+|\s+$/g,'').split("\n"); //4
					var random = Math.floor(Math.random()*feedList.length); //5
					next(false,feedList[random]);
				}
			});
		},

		function(feedUrl){
			request({uri:feedUrl},function(err,response,body){  //6
				if(err){
					next(err.message);
				}else if(response.statusCode=200){
					next(false, body);
				}
				else{
					next('Abnormal request status code');
				}
			});
		},

		function (rss){
			var handler  = new htmlparser.Rsshandler();
			var parser = new htmlparser.Parser(handler);
			parser.parseComplete(rss); //7

			if(handler.dom.items.length){
				var item = handler.dom.items.shift();
				console.log(item.title);  //8
				console.log(item.link);
			}else{
				next('No Rss item found');
			}
		}
	
	];

	function next(err,result){  //9
		if(err)throw new Error(err); //10
		var currentTask = tasks.shift(); //11

		if(currentTask){
			currentTask(result);  //12
		}
	}

	next(); //13