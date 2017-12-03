var express = require('express');
var path    = require("path");
var app  = express();

console.log('running');

app.use('/', express.static('public'));
app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname+'/public/index.html'));
})
app.listen(5555);
