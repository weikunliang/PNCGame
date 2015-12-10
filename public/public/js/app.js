// the jQery onclick functions for the get put post and delete methods
$(document).ready(function() {
    $('#create').click(function(event) {
    	var playerUrl = "ranking?name="+$('#playerName').val()+"&score="+$('#score').val()+"&rank="+$('#rank').val();
    	console.log(playerUrl);
    	$.ajax({
	    url: playerUrl, 
	    type: 'PUT',
	    success: function(result) {
	      // Do something with the result
	      console.log(result);
	      }
	    });
	    event.preventDefault();

    });

    $('#update').click(function() {
    	var playerUrl = "ranking?name="+$('#playerName').val()+"&score="+$('#score').val()+"&rank="+$('#rank').val();
    	$.ajax({
	    url: playerUrl, 
	    type: 'POST',
	    success: function(result) {
	      // Do something with the result
	      	console.log(result);
	      }, 
	    error: function(result, ajaxOptions, thrownError){
	    	$("#results").text("Player not found");
	    }
	    });
	    event.preventDefault();
    });
    $('#delete').click(function() {
    	var playerUrl = "ranking?name="+$('#playerName').val()+"&score="+$('#score').val()+"&rank="+$('#rank').val();
    	$.ajax({
	    url: playerUrl, //ex.'avenir/'
	    type: 'DELETE',
	    success: function(result) {
	      // Do something with the result
	      	console.log(result);
	      }, 
	     error: function(result, ajaxOptions, thrownError){
	    	$("#results").text("Player not found");
	    }
	    });
	    event.preventDefault();
    });

});