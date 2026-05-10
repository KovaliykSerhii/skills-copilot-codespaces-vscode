// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer(function (req, res) {
  // Parse the request URL
  var parsedUrl = url.parse(req.url, true);
  var pathname = parsedUrl.pathname;

  // Handle different routes
  if (pathname === '/comments') {
    // Read comments from a file (for simplicity, using a JSON file)
    fs.readFile('comments.json', 'utf8', function (err, data) {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      }
    });
  } else if (pathname === '/add-comment' && req.method === 'POST') {
    let body = '';
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end', function () {
      // Parse the comment from the request body
      var comment = JSON.parse(body);

      // Read existing comments, add the new comment, and write back to the file
      fs.readFile('comments.json', 'utf8', function (err, data) {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        } else {
          var comments = JSON.parse(data);
          comments.push(comment);
          fs.writeFile('comments.json', JSON.stringify(comments), function (err) {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Internal Server Error');
              return;
            } else {
              res.writeHead(200, { 'Content-Type': 'text/plain' });
              res.end('Comment added successfully');
            }
          });
        }
      });
    });
  } else {
    // Handle 404 Not Found
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}).listen(3000, function () {
  console.log('Server is listening on port 3000');
});