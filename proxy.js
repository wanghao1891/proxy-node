var http = require('http');
var exec = require("child_process").exec;

http.createServer(function (req, res) {
    url = require('url').parse(req.url);
    console.log(url);

    command = "";

    if (url.pathname === '/insert') {
        //http://192.168.56.21/insert?db=data-01&id=1&name=Tom&password=123456
        console.log(url.pathname);
        args = url.query.split("&");
        db = "";
        id = "";
        name = "";
        password = "";

        for (i=0;i<args.length;i++) {
            console.log(args[i]);
            kv = args[i].split("="); 
            k = kv[0];
            v = kv[1];
            switch(k){
                case "db":
                db = v;
                break;
                case "id":
                id = v;
                break;
                case "name":
                name = v;
                break;
                case "password":
                password = v;
                break;
            }
        }

        command += "insert.ss " + db + " " + id + " " + name + " " + password;
        console.log(command);
    }

    if (command != "") {
        command = "cd /root/workspace/database/; petite --script " + command;
        exec(command, function (error, stdout, stderr) {
            console.log("error" + error);
            console.log("stdout" + stdout);
            console.log("stderr" + stderr);
            var content = "";

	    if (error === null) {
		content = "Success in inserting a record!"
	    }
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(content + '\n');
        });
    }
}).listen(80, '0.0.0.0');

console.log('Server running at http://0.0.0.0/');
