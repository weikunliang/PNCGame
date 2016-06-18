$(document).ready(function(){

	// connects the socket
	var socket = io.connect();

    // when someone creates a room
    $('#create').click(function () {
        var username = $('#username').val(); // username of the player
        var playerType = $("input[name=player]:checked").val();
        var room = $("#room").val();
        socket.emit('createRoom', {username: username, playerType: playerType, room: room});
    });

    // After the user enters an username and hits join
	$('#join').click(function () {
		var username = $('#username').val(); // username of the player
		var playerType = $("input[name=player]:checked").val();
        var room = $("#room").val();
		socket.emit('joinRoom', {username: username, playerType: playerType, room: room});
	});

    socket.on('wrongRoom', function(data) {
        $('.wrongCode').modal()
    });

	socket.on('choseGame', function(data){
		$('.initialPage').fadeOut();
		$('.spinGame').fadeIn();
    });

	socket.on('choseCategory', function(data){
		$('.initialPage').fadeOut();
		$('.spinCategory').fadeIn();
    });

    $('#digit').click(function () {
    	$('.spinGame').fadeOut();
		$('.waitingForParent').fadeIn();
		socket.emit('gameSelected', {game: "digit"});    	
    });

    $('#bonkers').click(function () {
        $('.spinGame').fadeOut();
        $('.waitingForParent').fadeIn();
        socket.emit('gameSelected', {game: "bonkers"});    
    });

    $('#home').click(function () {
    	$('.spinCategory').fadeOut();
    	$('#category').append("Home");
		$('.inputInformation').fadeIn();
		socket.emit('categorySelected', {category: "home"});  
    });

    $('#costSubmit').click(function () {
    	var item =  $('#item :selected').text();
    	var cost = $('#cost').val();
    	var per = $("input[name=per]:checked").val();
    	socket.emit('saveCost', {item: item, cost: cost, per: per});
    });

    socket.on('waitForTeen', function(data) {
    	$('.inputInformation').fadeOut();
    	$('.waitingForTeen').fadeIn();
    });

    // DIGITS GAME

    socket.on('startDigit', function(data) {
    	$('#categoryName').append(data.category);
    	$('#perValue').append(data.per);
    	var missingID = data.missing;
    	var digitArray = data.digits;
  		var element;
    	for(var i=0; i<digitArray.length; i++) {
    		if(i != missingID) {
    			element = digitArray[i];
    		} else {
    			element = "_"
    		}

    		$('.digitList ul').append('<li>' + element + '</li>');
    	}

    	var missingDigitPlace = Math.floor((Math.random() * 2) + 1);
    	var seenDigit = [];
    	seenDigit.push(digitArray[missingID]);
    	for(var i=0; i<3; i++) {
    		if(i == missingDigitPlace){
    			element = digitArray[missingID];
    		} else {
    			element = Math.floor((Math.random() * 9) + 1);
    			while(seenDigit.indexOf(element) != -1){
    				element = Math.floor((Math.random() * 9) + 1);
    			}
    			seenDigit.push(element);
    		}

    		$('.choices').append('<input type="radio" name="choice" value=' + element + '> ' + element);
    	}

    	$('.waitingForParent').fadeOut();
    	$('.missingDigitScreen').fadeIn();
    });

	
	$('#guess').click(function () {
		var guess = $("input[name=choice]:checked").val();
		socket.emit('checkGuess', {guess: guess})
	});

	socket.on('parentWin', function (data) {
		$('.parentWin').modal()
	});

	socket.on('teenWin', function (data) {
		$('.teenWin').modal()
	});


    // BONKERS GAME

    socket.on('startBonkers', function (data) {
        $('#categoryNameBonkers').append(data.category);
        $('#perValueBonkers').append(data.per);
        $('#bonkersNumber').append(data.guess)
        $('.waitingForParent').fadeOut();
        $('.bonkersScreen').fadeIn();
    });

    $('#guessBonkers').click(function () {
        var guess = $("input[name=bonkersVal]:checked").val();
        socket.emit('bonkersResult', {guess: guess});
    });

    $(".close").click(function () {
            $('.modal-backdrop').fadeOut();
    });


});