var http = require('http');
var exec = require("child_process").exec;
var fs = require("fs");
var filePath = "/root/workspace/proxy-node/";

function execCommand(res){
    command = "cd /root/workspace/database/; petite --script " + command;
    console.log(command);
    exec(command, function (error, stdout, stderr) {
        console.log("error" + error);
        console.log("stdout" + stdout);
        console.log("stderr" + stderr);
        var content = "";

	if (error === null) {
	    content = stdout;
	}
        res.writeHead(200, contentType);
	if (isBinary) {
	    res.write(eval(content), "binary");
	    res.end();
	} else {
            res.end(content + '\n');
	}
    });
}

function getFile(){
    isBinary = true;

    console.log(url.query);
    fileName = url.query;
    
    switch(fileName.split(".")[1]) {
    case "html":
	contentType={'Content-Type': 'text/html'};
	break;
    case "js":
	contentType = {'Content-Type': 'application/x-javascript'};
	break;
    case "png":
	contentType = {'Content-Type': 'image/png'};
	break;
    }

    command = "file.ss " + filePath + fileName;
}

function getArg(url){
    args = [];
    arg = "";
    console.log("url.query: " + url.query);
    if(url.query != null){
	args = url.query.split("&");
    }else if(postData != ""){
	args = postData.split("&");
    }

    console.log("args: " + args);

    for (i=0;i<args.length;i++) {
        console.log(args[i]);
        kv = args[i].split("=");
	arg += " " + decodeURIComponent(kv[1]);
    }
    
    console.log("arg: " + arg);
    return arg;
}

function route(req, res) {
    url = require('url').parse(req.url);
    command = url.pathname.split("/")[1];
    
    switch(command) {
    case "file":
	getFile();
	break;
    case "favicon.ico":
	command = "";
	break;
    default:
	isBinary = false;
	command += ".ss" + getArg(url);
    }

    if (command != "") {
	execCommand(res);
    }
}

http.createServer(function (req, res) {
    //console.log(req);
    url = require('url').parse(req.url);
    console.log(url);

    command = "";
    contentType = {'Content-Type': 'text/html'};
    isBinary = false;
    postData = "";

    req.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
      console.log("Received POST data chunk '" + postDataChunk + "'.");
    });

    req.addListener("end", function() {
	console.log("End.");

	route(req, res);
    });
}).listen(80, '0.0.0.0');

console.log('Server running at http://0.0.0.0/');
