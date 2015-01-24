var http = require('http');
var exec = require("child_process").exec;
var fs = require("fs");

function insert(res) {
    console.log(url.pathname);
    args = postData.split("&");
    db = "data-01"
    name = "";
    pronunciation = "";
    sound = "";
    definition = "";

    for (i=0;i<args.length;i++) {
        console.log(args[i]);
        kv = args[i].split("="); 
        k = kv[0];
        v = kv[1];
        switch(k){
        case "name":
            name = v;
            break;
        case "pronunciation":
            pronunciation = v;
            break;
        case "sound":
            sound = decodeURIComponent(v);
	    console.log(v);
	    console.log(sound);
            break;
        case "definition":
            definition = v;
            break;
        }
    }

    command = "insert.ss " + db + " " + name + " " + pronunciation + " " + sound + " " + definition;
    console.log(command);

    exec_command(res);
}

function exec_command(res){
    command = "cd /root/workspace/database/; petite --script " + command;
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

	if (url.pathname === '/insert') {
	    insert(res);
	}
    });

    if (url.pathname === '/file') {
	isBinary = true;

	console.log(url.query);
	filename = url.query;
	
	switch(filename.split(".")[1]) {
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

	command = "file.ss /root/workspace/proxy-node/" + filename;
    }

    if (url.pathname === '/create'){
	isBinary = false;
	command = "create.ss"
    }

    if (url.pathname === '/get') {
	isBinary = false;
	command = "get.ss"
    }

    if (url.pathname === '/html') {
	isBinary = false;
	command = "html.ss";
    }

    if (command != "") {
	exec_command(res);
    }
}).listen(80, '0.0.0.0');

console.log('Server running at http://0.0.0.0/');
