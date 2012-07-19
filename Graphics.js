var gWIN = [];

// Graphical Layer
var gCREATE = function() {
  
  var x = 0, y = 0;
  
  var Width, Height;
  
  var Visible;
  
  // Bitmap images are treated differently
  var IsBMP = false;
  
  this.gAT = function(x,y) {
    this.x = x;
    this.y = y;
  }
  
  this.gMOVE = function(x, y) {
    this.x += x;
    this.y += y;
  }
  
  this.gCLS = function() {
    // Clear the screen
  }
  
  this.gLINEBY = function(x, y) {
    // Draws a line from the current position to the end offset
  }
  
  this.gLINE = function() {
    // Draws a line from two sets of co ords
  }
}

function gUSE(i) {
  if (i < 0 || i >= gWINDOW.length) {
    wO('gUSE request out of bounds');
  }
}