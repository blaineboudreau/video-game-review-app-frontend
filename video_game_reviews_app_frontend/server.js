var express = require('express');
var app = express();
var mongoose = require('mongoose');
var pg = require('pg');

var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/call_of_review_app';


mongoose.connect(mongoUri)

port = process.env.PORT || 3000;
app.use(express.static('public'));



app.listen(port);
console.log('---------------------------------');
console.log('Server running on port: ' + port);
console.log('---------------------------------');
