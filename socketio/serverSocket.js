var Player = require('../models/player.js');
var savedImages = require('../models/mongoModel.js');

exports.init = function(io) {
	var currentPlayers = 0; // keep track of the number of players
	var players = []; // keeps track of all the players in the game
	var artistID; // the current artist that is drawing
	var img;
	var answers = [];
	var word;
	var wordCollection = [];
	var usedWords = [];
	var oldImages;

	function sendHeartbeat(){
	    setTimeout(sendHeartbeat, 8000);
	    io.sockets.emit('ping', { beat : 1 });
	}


    // When a new connection is initiated
	io.sockets.on('connection', function (socket) {
		console.log('Connection started');

		socket.on('pong', function(data){
	        console.log("Pong received from client");
	    });
	    setTimeout(sendHeartbeat, 8000);

		function getNewWord() {
			var i = Math.floor((Math.random() * wordCollection.length));
			while(usedWords.length!=wordCollection.length && !contains(wordCollection[i].word)) {
				i = Math.floor((Math.random() * wordCollection.length));
			}
			return wordCollection[i].word;
		}

		function contains(word) {
			for(var i=0; i<usedWords.length; i++) {
				if(usedWords[i] == word) {
					return false;
				}
			} 
			return true;
		}

		function getNewArtist() {
			var i = Math.floor(Math.random() * players.length);
			return players[i].getID();
		}

		function retrieveImg(word) {
			savedImages.retrieve('savedImages', {"word":word}, function(result) {
				console.log(result);
				oldImages = result;
				socket.emit('displayImg', {imgs:result});
			});
		}


		// When a new user joins the game
		socket.on('welcomePlayer', function (data) {
			console.log('Player Joined');
			currentPlayers++;
			var newPlayer;
			if(currentPlayers == 1) {
				newPlayer = new Player(socket.id, data.name, true);
				players.push(newPlayer);
				socket.emit('artistWaiting', {name: data.name});
				artistID = socket.id;
			} else {
				newPlayer = new Player(socket.id, data.name, false);
				players.push(newPlayer);
				socket.emit('playerWaiting', {name: data.name});
			}
			io.emit('playerList', {players: players});
		}); 

		// When the artist clicks start game
		socket.on('gameStarted', function (data) {
			console.log('Game Started');
			wordCollection = data.words;
			word = getNewWord();
			usedWords.push(word);
			retrieveImg(word);
			socket.emit('drawImage', {word: word});
			socket.broadcast.emit('waitForArtist');
		});

		socket.on('guessImage', function (data) {
			img = data.image;
			socket.emit('waitToGuess');
			socket.broadcast.emit('playerGuess', {image: data.image});

			// Use Mongo to save the image
			savedImages.create('savedImages', {'word':word, 'image':img}, function(success) {
				if(success) {
					console.log("Inserted Correctly");
				} else {
					console.log("Unable to Peform Insert Operation");
				}
			});

		});

		socket.on('submitAnswer', function (data) {
			var correct;
			answers.push(data.answer);
			if(data.answer.toLowerCase() == word.toLowerCase()) {
				correct = true;
			} else {
				correct = false;
			}

			socket.emit('showAnswer', {correctAnswer: word, answerCorrect: correct, image: img});

			if(answers.length == currentPlayers - 1) {
				io.sockets.connected[artistID].emit('showPlayerGuesses', {guesses: answers, image: img, imgCollection: oldImages});
			}

		});
	

		socket.on('newRound', function (data) {
			io.emit('clear');
			artistID = getNewArtist();
			answers = [];
			word = getNewWord();
			io.sockets.connected[artistID].emit('displayNewRoundArtist', {word: word});
			for(var i=0; i<players.length; i++) {
				var currID = players[i].playerId;
				if(currID != artistID) {
					io.sockets.connected[currID].emit('displayNewRoundGuess');
				}
			}
		});

		socket.on('restart', function (data) {
			currentPlayers = 0; // keep track of the number of players
			players = []; // keeps track of all the players in the game
			artistID = -1; // the current artist that is drawing
			img = null;
			answers = [];
			word = '';
			wordCollection = [];
			usedWords = [];
		});

		/*
		 * Upon this connection disconnecting (sending a disconnect event)
		 * decrement the number of players and emit an event to all other
		 * sockets.  Notice it would be nonsensical to emit the event back to the
		 * disconnected socket.
		 */
		socket.on('disconnect', function () {
			io.emit('gameDisconnected');
			currentPlayers = 0; // keep track of the number of players
			players = []; // keeps track of all the players in the game
			artistID = -1; // the current artist that is drawing
			answers = [];
			word = "";
			wordCollection = [];
			usedWords = [];
		});
	});
}
