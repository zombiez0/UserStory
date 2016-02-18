var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');

var app = express();

/* For Socket IO */
var http = require('http').Server(app);
var io = require('socket.io')(http);
/* For Socket IO */


app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));


//Use the api file 
var api = require('./app/routes/api')(app, express, io);	//added io for socket.io
app.use('/api', api);

mongoose.connect(config.database, function(err){
	if(err) {
		console.log(err);
	}else{
		console.log("connected to db!");
	} 
}); 

app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/views/index.html');
});

http.listen(config.port, function(err){		/* app.listen(config.port, function(err){ */
	if(err) {
		console.log(err);
	}else{
		console.log('Listening to port 3000');
	} 
}); 