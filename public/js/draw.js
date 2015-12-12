window.onload = function() {
  document.ontouchmove = function(e){ e.preventDefault(); }

  var canvas  = document.getElementById('main');

  // HTML5 has a context 2d that allows for drawing lines, dots, etc.
  var context = canvas.getContext("2d");

  var lastx;
  var lasty;

  context.strokeStyle = "#000000";
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.lineWidth = 5;

  function clear() {
    context.fillStyle = "#ffffff";
    context.rect(0, 0, canvas.width, canvas.height);
    context.fill();
  }

  function dot(x,y) {
    context.beginPath();
    context.fillStyle = "#000000";
    context.arc(x,y,1,0,Math.PI*2,true);
    context.fill();
    context.stroke();

    context.closePath();
  }

  function line(fromx,fromy, tox,toy) {
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
      // draw parallel lines 15, 15 away from touched line
      // context.moveTo(fromx+15, fromy+15);
      // context.lineTo(tox+15, toy+15);
    context.stroke();
    context.closePath();
  }

///////////////////////////////////////////////////////////////////////////////// CLICK
var clicking = false;

$('#main').mousedown(function(e){
    var rect = document.getElementById('main').getBoundingClientRect();
    clicking = true; 
    lastx = (e.pageX - rect.left)/rect.width * canvas.width; 
    lasty = (e.pageY - rect.top)/rect.height * canvas.height; 

    dot(lastx,lasty);

});

$(document).mouseup(function(e){
    clicking = false;
});

$('#main').mousemove(function(e){
  var rect = document.getElementById('main').getBoundingClientRect();
  if(clicking === false) return;

  var newx = (e.pageX - rect.left)/rect.width * canvas.width;
  var newy = (e.pageY - rect.top)/rect.height * canvas.height;

  line(lastx,lasty, newx,newy);
  
  lastx = newx;
  lasty = newy;
});

///////////////////////////////////////////////////////////////////////////////// TOUCH
var doOnTouchStart = function(event){                   
  event.preventDefault();  
  lastx = (event.touches[0].clientX - canvas.offsetLeft)/rect.width * canvas.width;  // try substituting 1
  lasty = (event.touches[0].clientY - canvas.offsetTop)/rect.height * canvas.height;   // or 2 for index for multitouch

  dot(lastx,lasty);
}

canvas.addEventListener("touchstart", doOnTouchStart);

var doOnTouchMove = function(event){                   
  event.preventDefault();                 

  var newx = (event.touches[0].clientX - canvas.offsetLeft)/rect.width * canvas.width;
  var newy = (event.touches[0].clientY - canvas.offsetTop)/rect.height * canvas.height;

  line(lastx,lasty, newx,newy);

  
  lastx = newx;
  lasty = newy;
}

canvas.addEventListener("touchmove", doOnTouchMove);

var clearButton = document.getElementById('clear');
clearButton.onclick = clear;

clear();

}