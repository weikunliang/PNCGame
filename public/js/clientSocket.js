$(document).ready(function(){
	var socket = io.connect("http://pictionary-weikunliang.rhcloud.com:8000");
	var username;
	var isArtist;
	var words;

	function redrawImage(canvasID, imageURL) {
		var canvas  = document.getElementById(canvasID);
	  	var context = canvas.getContext("2d");
		var dataURL = imageURL;
		img = new Image;
		img.onload = function () {
		    context.drawImage(img, 0, 0);
		}
		img.src = dataURL; 
	}

	function clearCanvas(canvas) {
		var canvas  = document.getElementById(canvas);
		var context = canvas.getContext("2d");
		context.fillStyle = "#ffffff";
	    context.rect(0, 0, 300, 300);
	    context.fill();
	}

	function clearAll() {
		clearCanvas('main');
		clearCanvas('solution');
		clearCanvas('image');
	}

	socket.on('ping', function(data){
      socket.emit('pong', {beat: 1});
    });

	// After the user enters an username and hits submit
	$('#join').click(function () {
		username = $('#username').val();
		socket.emit('welcomePlayer', {name: username});
	});

	socket.on('displayImg', function (data) {
		console.log(data.imgs);
		if(data.imgs.length == 0) {
			clearCanvas("otherDrawing");
			var canvas = document.getElementById("otherDrawing");
			var ctx = canvas.getContext("2d");
			ctx.font = "Futura";
			ctx.fillStyle = "blue";
			ctx.textAlign = "center";
			ctx.fillText("No Other Drawings", canvas.width/2, canvas.height/2); 
		} else {
			clearCanvas("otherDrawing");
			var i = Math.floor((Math.random() * data.imgs.length));
			redrawImage('otherDrawing', data.imgs[i].image);
		}
	});

	socket.on('artistWaiting', function (data) {
		console.log('Artist Waiting...');
		isArtist = true;
		$('.initialPage').fadeOut();
		$('.header').fadeIn();
		$('.artistWaiting').fadeIn();
		$('.usernameArea').text(data.name);
	});

	socket.on('playerWaiting', function (data) {
		console.log('Player Waiting...');
		isArtist = false;
		$('.initialPage').fadeOut();
		$('.header').fadeIn();
		$('.playerWaiting').fadeIn();
		$('.usernameArea').text(data.name);
	});

	socket.on('playerList', function (data) { 
		$(".currentPlayers ul").empty();
		for(var i=0; i<data.players.length; i++) {
			$('.currentPlayers ul').append('<li class="list-group-item">' + data.players[i].username + '</li>');
		}
	});

	$('#startGame').click(function() {
	    words = [
	{ "word":"Cat"}, { "word":"Windmill"}, { "word":"Gingerbread"}, { "word":"Throne"}, { "word":"String"}, { "word":"Dog"}, { "word":"Stairs"},{ "word":"Frankenstein"}, { "word":"Goldfish"},{ "word":"Violin"}, { "word":"Head"},{ "word":"Football"}, { "word":"Dance"}, { "word":"Alligator"}, { "word":"Stop"},{ "word":"Swing"},{ "word":"Mailbox"},{ "word":"Spider man"},{ "word":"Puppet"},{ "word":"Penguin"}, { "word":"Shovel"}, { "word":"Popcorn"},{ "word":"Butter"},{ "word":"Haircut"},{ "word":"Shopping trolley"},{ "word":"Lipstick"},{ "word":"Soap"},{ "word":"Mop"},{ "word":"Food"},{ "word":"Glue"},{ "word":"Hot"},{ "word":"See-saw"},{ "word":"Jellyfish"},{ "word":"Scarf"},{ "word":"Seashell"},{ "word":"Rain"},{ "word":"Bike"},{ "word":"Roof"},{ "word":"Bear"},{ "word":"Elbow"},{ "word":"Earthquake"},{ "word":"Summer"},{ "word":"Snowball"},{ "word":"Guitar"},{ "word":"Alarm"},{ "word":"Volleyball"}];
		socket.emit('gameStarted', {words: words});
	});

	socket.on('waitForArtist', function (data) {
		$('.playerWaiting').fadeOut();
		$('.waitScreen').fadeIn();
	});

	socket.on('drawImage', function (data) {
		$('.artistWaiting').fadeOut();
		$('.drawScreen').fadeIn();
		$('.guessWord').text(data.word);
	});

	$('#submit').click(function () {
		var canvas  = document.getElementById('main');
		var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
		socket.emit('guessImage', {image: image});
	});

	socket.on('waitToGuess', function (data) {
		$('.drawScreen').fadeOut();
		$('.artistWaitScreen').fadeIn();
	});

	socket.on('playerGuess', function (data) {
		$('.waitScreen').fadeOut();
		$('.guessScreen').fadeIn();

		redrawImage('image', data.image);
	});

	$('#guess').click(function () {
		var answer = $('#answer').val();
		socket.emit('submitAnswer', {answer: answer});
	});

	socket.on('showAnswer', function (data) {
		$('.guessScreen').fadeOut();
		$('.solutionScreen').fadeIn();
		redrawImage('solution', data.image);

		$('#answerWord').text(data.correctAnswer);
		if(data.answerCorrect){
			$('.correct').text("RIGHT");
		} else {
			$('.correct').text("WRONG");
		}
	});

	socket.on('showPlayerGuesses', function (data) {
		$('#allAnswers ul').empty();
		for(var i=0; i<data.guesses.length; i++) {
			$('#allAnswers ul').append('<li class="list-group-item">' + data.guesses[i] + '</li>');
		}

		$('.artistWaitScreen').fadeOut();
		$('.allSolutionScreen').fadeIn();
	});

	$('#nextRound').click(function () {
		console.log('nextRound');
		socket.emit('newRound');
	});

	socket.on('clear', function (data) {
		clearAll();
		$('.container').fadeOut();
		$('.header').fadeIn();
		$('#answer').val('');
	});

	socket.on('displayNewRoundGuess', function (data) {
		$('.waitScreen').fadeIn();
	});

	socket.on('displayNewRoundArtist', function (data) {
		$('.drawScreen').fadeIn();
		$('.guessWord').text(data.word);
	});

	socket.on('gameDisconnected', function (data) {
		clearAll();
		$('.container').fadeOut();
		$('.disconnect').fadeIn();
		socket.emit('restart');
	});

});