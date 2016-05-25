$(document).ready(function(){

	// connects the socket
	var socket = io.connect();

	// pings the server every once in a while so that it doesn't disconnect
	socket.on('ping', function(data){
      socket.emit('pong', {beat: 1});
    });

    // After the user enters an username and hits join
	$('#join').click(function () {
		username = $('#username').val(); // username of the player
		console.log($("input[name=player]:checked").val()+" has joined");
		//socket.emit('welcomePlayer', {name: username}); // emits welcome player and passes in the username
	});


});