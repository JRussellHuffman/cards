
//technical stuff for setup with node and socket
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

function handler (req, res) {
	fs.readFile(__dirname + '/public/index.html',
	function (err, data) {
		res.writeHead(200);
		res.end(data);
	});
	console.log("user connected");
}

http.listen(4000, function(){
	console.log('listening on *:4000');
});

var express = require('express');
var path = require('path');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/');
});
app.use('/admin', function(req, res, next) {
  // GET 'http://www.example.com/admin/new'
  console.log(req.originalUrl); // '/admin/new'
  console.log(req.baseUrl); // '/admin'
  console.log(req.path); // '/new'
  next();
});
//allows app to use css and js in another folder
app.use('/public/js', express.static(path.join(__dirname, '/public/js')));
app.use('/public/css', express.static(path.join(__dirname, '/public/css')));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use("/public/assets", express.static(__dirname + '/public/assets'));

var numUsers = 0;
var players = 0;
//connected clients
var clients = [];
var hands = []

io.on('connection', function (socket) {
	console.log("user connected to socket");

	players ++;

	clients.push(players);
	console.log(players);
	console.log(clients);

	socket.on('disconnect', function(){
		console.log("user disconnected from socket");
		io.emit("gone", clients);
		clients = [];
		hands = [];

		io.emit("removeHand", 1);
	});

	io.emit("assignId", players)

	socket.on("returnID", function(msg) {
		clients.push(msg[0]);
		console.log(clients);
		if (msg[1] == true) {
			io.emit("user", msg[0]);
			hands.push(msg[0]);
		}
	})

	//handle clients
	socket.on("addHand", function(msg) {
		//players += msg;
		//clients.push(players);
		console.log("player " + msg + " joining");
		//console.log("leaving client name : " + msg);
		io.emit("user", msg);
		hands.push(msg);
		console.log("hands are: " + hands);
	})

	socket.on("amTable", function(msg) {
		console.log("am table: " + hands)
		io.emit("playersAtTable", hands)
	})

	//move cards

	socket.on("give", function(msg) {
		console.log("take: " + msg);
		io.emit("take", msg);
	})

	socket.on("playFromHand", function(msg) {
		console.log("play from hand: " + msg);
		io.emit("toTable", msg);
	})

});