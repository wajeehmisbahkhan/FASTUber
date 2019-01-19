//Server Setup
var express = require('express');

var app = express();

var port = process.env.PORT || 3000;

var server = app.listen(port, started);

function started () {
    console.log("Server has started listening at: " + port);
}

//Serve files from
app.use(express.static('app/www'));