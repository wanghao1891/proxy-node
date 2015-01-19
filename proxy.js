var http = require('http');
var exec = require("child_process").exec;

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
	    //content = "Success in inserting a record!"
	    content = stdout;
	}
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(content + '\n');
    });
}

http.createServer(function (req, res) {
    //console.log(req);
    url = require('url').parse(req.url);
    console.log(url);

    command = "";

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

    if (url.pathname === '/create'){
	command = "create.ss"
    }

    if (url.pathname === '/get') {
	command = "get.ss"
    }

    if (url.pathname === '/html') {
	command = "html.ss";
    }

    if (command != "") {
	exec_command(res);
    }
}).listen(80, '0.0.0.0');

console.log('Server running at http://0.0.0.0/');
