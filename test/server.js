
var http = require('http');
var fs = require('fs');

let c = fs.readFileSync(`${__dirname}/index.html`, { 'encoding': 'utf8' });

http.createServer(function (req, res) {
    if (req.url.match(/static/)) {
        console.log(req.url)
        fs.readFile(__dirname + req.url.replace(/\/static/, ''), function (err, data) {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200);
            res.end(data);
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(c);
    }

}).listen(3000);

console.log('服务器开启在：http://localhost:3000/');