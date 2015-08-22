var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

mongoose.connect(config.database, function (err) {  //Подключение к MongoDB
	if(err) {
		console.log(err);

	} else {
<<<<<<< HEAD
		console.log('Connect to DB');
=======
		console.log('connect to DB');
>>>>>>> c75647532791931aa64ed698373706bd543e80ee
	}
});

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(morgan ('dev'));

app.use(express.static(__dirname + '/public'));

var api = require('./app/routes/api')(app, express, io);
app.use('/api', api);

app.get('*', function (req, res) {
	res.sendFile(__dirname + '/public/app/views/index.html');
});

http.listen(config.port, function(err) {
	if(err) {
		console.log(err);
			}
			else {
<<<<<<< HEAD
				console.log("list Port 3000");
=======
				console.log("Listening Port 3000");
>>>>>>> c75647532791931aa64ed698373706bd543e80ee
			}
});
