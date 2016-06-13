var Player = require('../models/player.js');
var Room = require('../models/room.js');

exports.init = function(io) {

	var rooms = [];
	
    // When a new connection is initiated
	io.sockets.on('connection', function (socket) {
		console.log('Connection started');

		// created a new room
		socket.on('createRoom', function (data) {
			var p = new Player(socket.id, data.username, data.playerType, data.room);
			socket.join(data.room);
			var r = new Room(data.room);
			if(data.playerType == "parent") {
				r.parentID = socket.id;
			} else {
				r.teenID = socket.id;
			}

			rooms.push(r);

			if(data.playerType == "parent"){
				io.sockets.connected[r.parentID].emit('choseCategory');
			} else {
				io.sockets.connected[r.teenID].emit('choseGame');
			}

		});

		// When a new user joins the game
		socket.on('joinRoom', function (data) {
			var r;
			var found = false;
			for(var i=0; i<rooms.length; i++) {
				r = rooms[i];
				if(r.getID() == data.room) {
					found = true;
					break;
				}
			}

			if(found == false) {
				io.sockets.connected[socket.id].emit('wrongRoom');
			} else {
				var p = new Player(socket.id, data.username, data.playerType, data.room);
				socket.join(data.room);

				if(data.playerType == "parent") {
					r.parentID = socket.id;
				} else {
					r.teenID = socket.id;
				}

				if(data.player == "parent"){
					io.sockets.connected[r.parentID].emit('choseCategory');
				} else {
					io.sockets.connected[r.teenID].emit('choseGame');
				}
			}
		}); 


		// teen selected game
		socket.on('gameSelected', function (data) {
			var teenID = socket.id;
			for(var i=0; i<rooms.length; i++) {
				if(rooms[i].getTeen() == teenID) {
					rooms[i].game = data.game;
					break;
				}
			}
		});

		// parent selected category
		socket.on('categorySelected', function (data) {
			var parentID = socket.id;
			for(var i=0; i<rooms.length; i++) {
				if(rooms[i].getParent() == parentID) {
					rooms[i].category = data.category;
					break;
				}
			}
		});

		socket.on('saveCost', function (data) { 
			var parentID = socket.id;
			var r;
			for(var i=0; i<rooms.length; i++) {
				if(rooms[i].getParent() == parentID) {
					r = rooms[i];
					rooms[i].item = data.item;
					rooms[i].cost = data.cost;
					rooms[i].per = data.per;
					rooms[i].digitArray = data.cost.toString(10).split("").map(function(t){return parseInt(t)});
					rooms[i].missingId = Math.floor((Math.random() * (rooms[i].digitArray.length-1)) + 1);
					rooms[i].guess = Math.floor((Math.random() * (data.cost-1)) + 1);
					break;
				}
			}

			io.sockets.connected[r.parentID].emit('waitForTeen');
			if(r.getGame() == "digit") {
				io.sockets.connected[r.teenID].emit('startDigit', {digits: r.digitArray, missing: r.missingId, per: r.per, category: r.category});
			} else if(r.getGame() == "bonkers") {
				io.sockets.connected[r.teenID].emit('startBonkers', {guess: r.guess, per: r.per, category: r.category});
			}
		});

		socket.on('checkGuess', function (data) {
			var teenID = socket.id;
			var r;
			for(var i=0; i<rooms.length; i++) {
				if(rooms[i].getTeen() == teenID) {
					r = rooms[i];
					break;
				}
			}

			if(data.guess == r.digitArray[r.missingId]) {
				io.sockets.connected[r.teenID].emit('teenWin');
			} else {
				io.sockets.connected[r.teenID].emit('parentWin');
			}
		});

	});
}
