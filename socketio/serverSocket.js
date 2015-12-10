var Player = require('../models/player.js');
var words = require('../models/mongoModel.js');

exports.init = function(io) {
	var currentPlayers = 0; // keep track of the number of players
	var players = []; // keeps track of all the players in the game
	var artistID; // the current artist that is drawing
	var img;
	var answers = [];
	var word;
	var wordCollection;
	var usedWords = [];

    // When a new connection is initiated
	io.sockets.on('connection', function (socket) {
		console.log('Connection started');

		function getNewWord() {
			var i = Math.floor((Math.random() * wordCollection.length) + 1);
			while(usedWords.length!=wordCollection.length && !contains(wordCollection[i].word)) {
				i = Math.floor((Math.random() * wordCollection.length) + 1);
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
			var i = Math.floor((Math.random() * players.length) + 1);
			return players[i].getID();
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
			io.emit('playerList', {newPlayer: newPlayer});
		}); 

		// When the artist clicks start game
		socket.on('gameStarted', function (data) {
			console.log('Game Started');
			wordCollection = data.words;
			word = getNewWord();
			usedWords.push(word);
			socket.emit('drawImage', {word: word});
			socket.broadcast.emit('waitForArtist');
		});

		socket.on('guessImage', function (data) {
			img = data.image;
			socket.emit('waitToGuess');
			socket.broadcast.emit('playerGuess', {image: data.image});
		});

		socket.on('submitAnswer', function (data) {
			var correct;
			answers.push(data.answer);
			if(data.answer == word) {
				correct = true;
			} else {
				correct = false;
			}
			socket.emit('showAnswer', {correctAnswer: word, answerCorrect: correct, image: img});

			if(answers.length == currentPlayers - 1) {
				io.sockets.connected[artistID].emit('showPlayerGuesses', {guesses: answers, image: img});
			}
		});
		
		socket.on('newRound', function (data) {
			artistID = getNewArtist();
			answers = [];
			word = getNewWord();
		});

		/*
		 * Upon this connection disconnecting (sending a disconnect event)
		 * decrement the number of players and emit an event to all other
		 * sockets.  Notice it would be nonsensical to emit the event back to the
		 * disconnected socket.
		 */
		socket.on('disconnect', function () {
			//--currentPlayers;
			//socket.broadcast.emit('players', { number: currentPlayers});
		});
	});
}
