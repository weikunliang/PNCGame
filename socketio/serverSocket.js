var Player = require('../models/player.js');

exports.init = function(io) {
	
	// sends heartbeat so that the server does not disconnect automatically
	function sendHeartbeat(){
	    setTimeout(sendHeartbeat, 8000);
	    io.sockets.emit('ping', { beat : 1 });
	}

    // When a new connection is initiated
	io.sockets.on('connection', function (socket) {
		console.log('Connection started');

		// sends heartbeat so that the server does not disconnect automatically
		socket.on('pong', function(data){
	        console.log("Pong received from client");
	    });
	    setTimeout(sendHeartbeat, 8000);


		// When a new user joins the game
		socket.on('welcomePlayer', function (data) {
			console.log('Player Joined');
		}); 

	});
}
