
var http = require('http');
var exec = require("child_process").exec;
var spawn = require("child_process").spawn;
var fs = require("fs");
var filePath = "/root/workspace/proxy-node/";

function execCommand(res, binary){
    command = "cd /root/workspace/database/; petite --script " + command;
    console.log(command);
    exec(command, {maxBuffer: 200*1024*200}, function (error, stdout, stderr) {
//        console.log("error" + error);
//        console.log("stdout" + stdout);
//        console.log("stderr" + stderr);
        var content = "";

	if (error === null) {
	    content = stdout;
	}
        res.writeHead(200, contentType);

	console.log(binary);

	if (binary) {
	    res.write(eval(content), "binary");
	    res.end();
	} else {
            res.end(content + '\n');
	}
    });
}

function getFile(res){
//    isBinary = true;

//    console.log(url.query);
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
    case "mp3":
	contentType = {'Content-Type': 'audio/mp3'};
	break;
    case "pdf":
	contentType = {'Content-Type': 'application/pdf'};
	break;
    }

    command = "file.ss " + filePath + fileName;

    /*fileName = "/root/workspace/proxy-node/out/" + fileName;
    fs.readFile(fileName, "binary", function(error, file) {
	if(error) {
	    res.writeHead(500, {"Content-Type": "text/plain"});
	    res.write(error + "\n");
	    res.end();
	} else {
	    console.log(file);
	    res.writeHead(200, contentType);
	    res.write(eval(file), "binary");
	    res.end();
	}
    });

    command = "";*/
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

//    console.log("args: " + args);

    for (i=0;i<args.length;i++) {
//        console.log(args[i]);
        kv = args[i].split("=");
	arg += " " + kv[1];//decodeURIComponent(kv[1]);
    }
    
//    console.log("arg: " + arg);
    return arg;
}

function route(req, res) {
    var isBinary = true;
    url = require('url').parse(req.url);
    command = url.pathname.split("/")[1];
    
    switch(command) {
    case "file":
	getFile(res);
	break;
    case "favicon.ico":
	command = "";
	break;
    default:
	isBinary = false;
	command += ".ss" + getArg(url);
    }

    if (command != "") {
	execCommand(res, isBinary);
    }
}

http.createServer(function (req, res) {
    //console.log(req);
    url = require('url').parse(req.url);
//    console.log(url);

    command = "";
    contentType = {'Content-Type': 'text/html'};
    isBinary = false;
    postData = "";

    req.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
//      console.log("Received POST data chunk '" + postDataChunk + "'.");
    });

    req.addListener("end", function() {
//	console.log("End.");

	route(req, res);
    });
}).listen(80, '0.0.0.0');

console.log('Server running at http://0.0.0.0/');
