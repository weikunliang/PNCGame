/*
 * This is the Player class which stores information about the player
 */

// Define a constructor function to initialize a new Player object
function Player(player_id, username, isArtist) { 	
	this.playerId = player_id;
	this.username = username;	
	this.isArtist = isArtist;		
}						

Player.prototype.isArtist = function() { // finds the area of the circle
	return this.isArtist;
};

Player.prototype.getUsername = function() {
	return this.username;
}

Player.prototype.getID = function() {
	return this.playerId;
}

/*
 * Export the Class
 */
 
module.exports = Player;