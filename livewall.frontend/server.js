var express = require('express');
var cors = require('cors');
var http = require('http');
var app = express();
var port = 4000;

app.get('/api.php*', cors(), function(req, res) {

    var path = req.originalUrl;
    console.log('path', path);

    http.get('http://ia.dailab.de/owa' + path, function (response) {

        var body = '';

        response.on('data', function(chunk) {
            body += chunk;
        });

        response.on('end', function() {
            var jsonObject = JSON.parse(body);
            res.status(200).json(jsonObject);
        });
    });

});

app.listen(port);
