//
// Each Window (gWIN) has the following internal properties
//
// 0 Window ID
// 1 X Position on screen
// 2 Y Position on Screen
// 3 Width
// 4 Height
// 5 Visibility
// 6 Colour Depth
// 7 Whether the Window is a bitmap
// 8 gPosX
// 9 gPosY
// 10 Canvas
// 11 Render Context
// 12 gFont
// 13 gStyle

// Note: Canvas line widths are done from 0.5 so co-ords are adjusted

var Renderer = {
  // Graphical Window Stack
  comCanvas: null,
  comContext: null,
  
  comBBCanvas: null,
  comBBContext: null,
  
  Fonts: ['8px Arial','Bold 8px Arial','8px Courier New','8px Courier New','8px Times New Roman','11px Times New Roman','13px Times New Roman','15px Times New Roman','8px Arial','11px Arial','13px Arial','15px Arial','6px Courier New'],
  
  Width: 480,
  Height: 160,
  
  RenderBorder: true,
  
  gWIN: [],
  
  AWnd: 0,
  ActiveID: 0,
  UpdateMode: 1,
  
  changed: false,
  
  // Property functions
  gX:function(){return this.AWnd[8];},
  gY:function(){return this.AWnd[9];},
  gORIGINX:function(){return this.AWnd[1];},
  gORIGINY:function(){return this.AWnd[2];},
  gWIDTH:function(){return this.AWnd[3];},
  gHEIGHT:function(){return this.AWnd[4];},
  gIDENTITY:function(){return this.ActiveID;},
  
  // Public functions
  gVISIBLE:function(v){this.AWnd[5]=v;},
  gAT:function(x,y){this.AWnd[8]=x;this.AWnd[9]=y;},
  gMOVE:function(x,y){this.AWnd[8]+=x;this.AWnd[9]+=y;},
  gLINETO:function(x,y){this.gLINEBY(x-this.gX(),y-this.gY());},
  gFONT:function(f){this.AWnd[12]=f;this.SetFont();},
  gSTYLE:function(s){this.AWnd[13]=s;this.SetFont();},
  gTWIDTH:function(t){return this.AWnd[11].measureText(t).width;}
}

// Graphical Layer
Renderer.gCREATE = function(x, y, width, height, visible, flags) {
  // Get an available Window ID
  var winID = -1;
  for(var i = 2; i < 65; i++) {
    var found = false;
	
    for (var j=0; j < this.gWIN.length; j++) {
	  if (this.gWIN[j][0]==i) {
	    found = true;
		break;
	  }
	}
	
	if (found) {
	  winID = i;
	  break;
	}
  }
  
  // Create a window object.
  this.gWIN.unshift([winID, x, y, width, height, visible, flags, 0, 0, 0, document.createElement('canvas'), null, 1, 0]);
  
  this.ActiveID = winID;
  this.AWnd = this.gWIN[0];
  
  this.AWnd[10].width = width;
  this.AWnd[10].height = height;
  
  // Add the render context
  this.AWnd[11] = this.AWnd[10].getContext('2d');
  
  
  this.SetFont();
  this.gCLS();
  
  return winID;
}

Renderer.Init = function() {
  wO('');
  // Create the Foreground buffer
  this.comCanvas = document.createElement('canvas');
  
  this.comCanvas.width = this.Width;
  this.comCanvas.height = this.Height;
  
  this.comContext = this.comCanvas.getContext('2d');
  
  // Create the backing buffer
  this.comBBCanvas = document.createElement('canvas');
  
  this.comBBCanvas.width = this.Width;
  this.comBBCanvas.height = this.Height;
  
  this.comBBContext = this.comBBCanvas.getContext('2d');
  
  // Clear
  this.comBBContext.fillStyle="#FF0000";
  this.comBBContext.fillRect(0,0,this.comBBCanvas.width,this.comBBCanvas.height);
  
  document.body.appendChild(this.comCanvas);
  wO('');
}

Renderer.Composite = function(force) {
  if (force || (this.changed && this.UpdateMode == 1)) {
    // Backtrack through the screens, laying out those that are visible to the back buffer.
    for(var i = this.gWIN.length - 1; i>=0; i--) {
      if (this.gWIN[i][5] == 1) {
	    this.comBBContext.drawImage(this.gWIN[i][10], this.gWIN[i][1], this.gWIN[i][2]);
	  }
    }
    
    // Reset the flag as the backbuffer has been updated
    this.changed = false;
  }
  
  // Render to foreground buffer
  this.comContext.drawImage(this.comBBCanvas, 0, 0);
  
  // Draw border
  if (this.RenderBorder) {
    this.comContext.strokeStyle="#FF0000";
    this.comContext.strokeRect(0,0,this.comCanvas.width,this.comCanvas.height);
  }
}

// Return the Index in gWIN for a particular ID.
Renderer.GetIndexForID = function(id) {
  for(var i = 0; i< this.gWIN.length; i++) {
    if (this.gWIN[i][0] == id) {
	  return i;
	}
  }
  
  return -1;
}

Renderer.gUPDATE = function(m) {
  if (m == 0 || m == 1) {
    this.UpdateMode = m;
  } else {
    this.Composite(true);
  }
}
  
Renderer.gCLS = function() {
  // Clear the screen
  var oFill = this.AWnd[11].fillStyle;
  
  this.AWnd[11].fillStyle="#FFFFFF";
  this.AWnd[11].fillRect(0,0,this.gWIDTH(),this.gHEIGHT());
  
  // Restore fill style
  this.AWnd[11].fillStyle = oFill;

  this.changed = true;
}
  
Renderer.gLINEBY = function(x, y) {
  // Draws a line from the current position to the end offset
  this.AWnd[11].moveTo(this.gX() + 0.5,this.gY() + 0.5);
  this.AWnd[11].lineTo(x,y);
  
  this.gMOVE(x, y);
  
  this.changed = true;
}

Renderer.gFILL = function(width, height, fillMode) {
  // Clear the screen
  var oFill = this.AWnd[11].fillStyle;
  
  // Restore fill style
  this.AWnd[11].fillStyle = oFill;

  if (fillMode == 0) {
    // Pixels are set
    this.AWnd[11].fillStyle="#000000";
    this.AWnd[11].fillRect(this.gX(),this.gY(), width, height);
  } else if (fillMode == 1) {
    // Pixels are cleared
    this.AWnd[11].fillStyle="#FFFFFF";
    this.AWnd[11].fillRect(this.gX(),this.gY(), width, height);
  } else {
    // Pixels are inverted
  }
  
  // Restore fill style
  this.AWnd[11].fillStyle = oFill;
  
  this.changed = true;
}


Renderer.gBOX = function(w, h) {
  this.AWnd[11].strokeRect(this.gX() + 0.5, this.gY() + 0.5, w, h); 
  
  this.changed = true;
}

// Creates the new font based on the gFONT and gSTYLE values
Renderer.SetFont = function() {
  var fontName = '';

  // Set the value based on gSTYLE
  var gFONTStyle = this.AWnd[13];
  if (gFONTStyle >= 32) {
    fontName += 'italic ';
	gFONTStyle-=32;
  }
  
  if (gFONTStyle >= 16) {
    // TODO: Monospaced - cant do
    fontName += '';
	gFONTStyle-=16;
  }
  
  if (gFONTStyle >= 8) {
    // TODO: Double Height - cant do
    fontName += '';
	gFONTStyle-=8;
  }
  
  if (gFONTStyle >= 4) {
    // TODO: Inverse - cant do
    fontName += '';
	gFONTStyle-=4;
  }
  
  if (gFONTStyle >= 2) {
    // TODO: Underlined - cant do
    fontName += '';
	gFONTStyle-=2;
  }
  
  if (gFONTStyle == 1) {
    fontName += 'bold';
  }
  
  var gFID = this.AWnd[12];
  
  if (gFID < 4 || gFID == 13) {
    fontName = '';
  } else if (gFID > 13) {
    gFID = 6;
  } 
  
  fontName += this.Fonts[gFID];
    
  this.AWnd[11].font = fontName;
}

Renderer.gPRINT = function(text) {
  // WORKAROUND: Offset text upwards slightly
  this.AWnd[11].fillText(text, this.gX(), this.gY() - 2);
  
  var txtwidth = this.AWnd[11].measureText(text).width;
  
  // Move the draw position once finished writing, no new line
  this.gMOVE(txtwidth, 0);
  
  this.changed = true;
}

Renderer.gPRINTCLIP = function(text, maxWidth) {
  var allowedChars = 0;
  
  // Work out the maximum number of letters that can fit in maxWidth
  for (var i = 0; i < text.length; i++) {
    if (this.gTWIDTH(text.substring(0, i)) <= maxWidth) {
      allowedChars = i;
    } else {
      break;
    }
  }
  
  this.gPRINT(text.substring(0, allowedChars));
}

Renderer.gBORDER = function(args) {
  
}

Renderer.gCLOSE = function(i) {
  if (i == 1 || this.GetIndexForID(i) == -1) {
    wO('ERROR: gCLOSE request out of bounds');
	return;
  }
  
  if (this.gWIN.length == 1) {
    wO('ERROR: gCLOSE cannot close all available graphics windows');
	return;
  }
  
  // Remove the Wnd
  this.gWIN.splice(this.GetIndexForID(this.ActiveID) - 1 ,1);
  
  // Reset to Wnd ID 1
  this.ActiveID = 1;
  this.AWnd = this.gWIN[this.GetIndexForID(1)];
  
  this.changed = true;
}

Renderer.gUSE = function(i) {
  var gID = this.GetIndexForID(i);
  
  if (gID == -1) {
    wO('ERROR: gUSE request out of bounds');
	return;
  }
  this.ActiveID = i;
  this.AWnd = this.gWIN[gID];
}

// Usage: gORDER id%, position%
Renderer.gORDER = function(i, p) {
  var gID = Renderer.GetIndexForID(i);
  
  if (i < 0 || gOD == -1 || p < 1) {
    wO('ERROR: gORDER request out of bounds');
	return;
  }
  
  if (Renderer.gWIN[gID][7] == 1) {
    wO('ERROR: Can not order Bitmap');
	return;
  }
  
  if (p == i) {
    // The new and old locations are the same position
    return;
  }
  
  // Extract the window to be reordered
  var gWINrom = Renderer.gWIN.splice(gID - 1 ,1);
  
  var normP = p;
  if (p >= Renderer.gWIN.length) {
    // Push the new entry to the end of the list
    Renderer.gWIN.push(gWINrom[0]);
  } else if (p < i){
    // New entry is infront of the removed
	Renderer.gWIN.splice(p - 1, 0, gWINrom[0]);
  } else {
    // New entry is behind the removed
	Renderer.gWIN.splice(p - 2, 0, gWINrom[0]);
  }
  
  // Update the active ID if it was the window that changed.
  if (Renderer.ActiveID == i) {
    this.ActiveID == p;
	this.AWnd = this.gWIN[this.GetIndexForID(p)];
  }
  
  this.changed = true;
}

