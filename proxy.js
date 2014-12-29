var http = require('http');
var exec = require("child_process").exec;

http.createServer(function (req, res) {
  exec("petite --script /root/workspace/database/base.ss", function (error, stdout, stderr) {
    var content = stdout;
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(content + '\n');
  });
}).listen(80, '0.0.0.0');
console.log('Server running at http://0.0.0.0/');
