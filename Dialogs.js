// Handle the creation of on screen dialog boxes

// Dialog items
// 1 dINIT
// 2 dTEXT
// 3 dEDIT
// 4 dFLOAT

// Note: Default values in the dialogs are extracted from the memory locations

var DialogManager = {
  dlgActive: false,
  
  dlgDecWidth: 9,
  dlgDecHeight: 9,
  dlgMargin: 4,
  dlgPadding: 10,
  dlgRowHeight: 20,
  
  
  dlgDefNumBoxWidth: 50,
  
  dlgMaxEditBoxWidth: 200,
  dlgMaxNumBoxWidth: 75,
  
  dlgInternalWidth: 0,
  
  dlgCanvas: null,
  dlgContext: null,
  
  posX: 0,
  posY: 0,
  
  dlgFont: '11px Arial',
  dlgItems: [],
  dlgFlags: 0,
  
  // Public Methods
  dPOSITION:function(x,y){this.posX=x;this.posY=y;}
}

DialogManager.Composite = function() {
  if (!this.dlgActive) {
    return;
  }
  
  // Work out the minimum internal bounding box size
  var minReqWidth = 0;
  var minReqHeight = 0;
  for (var i=0; i<this.dlgItems.length; i++) {
    minReqWidth = Math.max(minReqWidth, this.dlgItems[i][1]);
    minReqHeight += this.dlgRowHeight;
  }
  
  // Note error if larger than screen, if so forcibly resize.
  // Also include margin for screen decorations
  minReqWidth = Math.min(minReqWidth + this.dlgPadding, Renderer.Width - this.dlgDecWidth);
  minReqHeight = Math.min(minReqHeight, Renderer.Height - this.dlgDecHeight);
  
  // Store the internal max width for when sub-components are rendering
  this.dlgInternalWidth = minReqWidth;
  
  // Clear the render context
  this.dlgContext.fillStyle="#FFFFFF";
  this.dlgContext.fillRect(0, 0, this.dlgCanvas.width, this.dlgCanvas.height);
    
  // Go through each layer of the dialog and render as required.
  for (var i=0; i<this.dlgItems.length; i++) {
    switch (this.dlgItems[i][0]) {
      case 1:
        this.Render_dINIT();
        break;
      case 2:
        this.Render_dTEXT(i);
        break;
      case 3:
        this.Render_dEDIT(i);
        break;
      case 4:
        this.Render_dFLOAT(i);
        break;
	  case 5:
	    this.Render_dCHOICE(i);
		break;
    }
  }
  
  // Draw the Dialog Window Decorations onto the foreground buffer
  var dW = minReqWidth + this.dlgDecWidth;
  var dH = minReqHeight + this.dlgDecHeight;
    
  var oX = 0, oY = 0;
  
  // Work out offset based on dPOSITION
  if (this.posX == 0) {
    oX = Renderer.Width / 2 - dW / 2;
  } else if (this.posX == 1) {
    oX = Renderer.Width - dW;
  }
  if (this.posY == 0) {
    oY = Renderer.Height / 2 - dH / 2;
  } else if (this.posY == 1) {
    oY = Renderer.Height - dH;
  }
  
  Renderer.comContext.fillStyle="#FFFFFF";
  Renderer.comContext.fillRect(oX, oY, dW, dH);
  
  // Draw the dialog to the Renderers foreground buffer
  Renderer.comContext.drawImage(
    this.dlgCanvas, 
    0,
    0,
    minReqWidth,
    minReqHeight,
    oX + 4, 
    oY + 4,
    minReqWidth,
    minReqHeight);
    
  Renderer.comContext.lineWidth = 1;
  Renderer.comContext.strokeStyle = "#000000";
  Renderer.comContext.strokeRect(oX + 0.5, oY + 0.5, dW - 1, dH - 1); //Outer border
  
  Renderer.comContext.strokeStyle = "#A0A0A0";
  Renderer.comContext.strokeRect(oX + 4.5, oY + 4.5, dW - 9, dH - 9); //Inner border
}

DialogManager.ProcessKey = function(keyCode) {
  if (keyCode == 13) {
    // For now just close the dialog
    this.dlgActive = false;
    this.SaveValues();
  }
  else
  {
	  // Add value to active dialog item.
	  if (this.dlgItems[this.activeItem][3] == 3)
	  {
		  // dTEXT box
		  this.dlgItems[this.activeItem][4] += String.fromCharCode(keyCode);
		  
		  this.Composite();
	  }
  }
}

DialogManager.SaveValues = function() {
  for (var i=0; i<this.dlgItems.length; i++) {
    if (this.dlgItems[i][0] > 2) {
      // Where the value gets stored is in position 2, Type 3, Current Value 4
      
      switch (this.dlgItems[i][3]) {
        case 0: // Int16
		  DSF.set(this.dlgItems[i][2], i162b(this.dlgItems[i][4]));
          break;
        case 1: // Int32
          break;
        case 2: // Float
          DSF.set(this.dlgItems[i][2], cf64(this.dlgItems[i][4]));
          break;
        case 3: // String
          DSF.set(this.dlgItems[i][2], Str2CStr(this.dlgItems[i][4]));
          break;
      }
    }
  }
}

DialogManager.dINIT = function(title, flags) {
  // Cancel any existing active dialog under construction
  this.dlgItems = [];
  
  this.activeItem = 0;
  
  this.posX = 0;
  this.posY = 0;
  
  // Create the dialog canvas
  this.dlgCanvas = document.createElement('canvas');
  
  this.dlgCanvas.width = Renderer.Width;
  this.dlgCanvas.height = Renderer.Height;
  
  this.dlgContext = this.dlgCanvas.getContext('2d');
  this.dlgContext.font = this.dlgFont;
  
  // If title is empty and flags = 0, no args were passed.
  this.dlgFlags = flags;
  
  // Work out the width of the text
  var reqWidth = this.dlgContext.measureText(title).width;
  
  // TODO check to see if the flags contain 2, is so, don't add to render stack
  this.dlgItems.push([1, reqWidth, title]);
}

DialogManager.Render_dINIT = function() {
  // There should really only ever be one dINIT, it will be the first element
  this.dlgContext.fillStyle  = "#A0A0A0";
  this.dlgContext.fillRect(0, 0, this.dlgInternalWidth, 18);
  
  this.dlgContext.fillStyle  = "#000000";
  var reqWidth = this.dlgContext.measureText(this.dlgItems[0][2]).width;
  this.dlgContext.fillText(this.dlgItems[0][2], this.dlgInternalWidth / 2 - reqWidth / 2, 12);
}

DialogManager.dTEXT = function(prompt, body, flags) {
  var reqWidth = this.dlgContext.measureText(prompt).width + this.dlgContext.measureText(body).width + 4;
  this.dlgItems.push([2, reqWidth, prompt, body, flags]);
}

DialogManager.Render_dTEXT = function(index) {
  // Left hand prompt message
  this.dlgContext.fillStyle  = "#000000";
  this.dlgContext.fillText(this.dlgItems[index][2], 4, this.dlgRowHeight * index + 12);
  
  // Draw the main body depending on the style selected, default is left align (0)
  var dlgTxtOffsetX = 4 + this.dlgContext.measureText(this.dlgItems[index][2]).width;
  if (this.dlgItems[index][2].length > 0) {
    // Add default devision between text blocks
    dlgTxtOffsetX += 4;
  }
  
  if (this.dlgItems[index][4] == 1) {
    // Right align
    dlgTxtOffsetX = this.dlgInternalWidth - 4 - this.dlgContext.measureText(this.dlgItems[index][3]).width
  } else if (this.dlgItems[index][4] == 2) {
    // Centre
    dlgTxtOffsetX -=4;
    dlgTxtOffsetX += (this.dlgInternalWidth - dlgTxtOffsetX) / 2 - this.dlgContext.measureText(this.dlgItems[index][3]).width / 2;
  }
  
  this.dlgContext.fillText(this.dlgItems[index][3], dlgTxtOffsetX, this.dlgRowHeight * index + 14);
}

DialogManager.dEDIT = function(varAddr, prompt, len, priv) {
  // Padding = 4 + 2 + 2
  var reqWidth = this.dlgContext.measureText(prompt).width + len + 12;
  
  if (len == -1) {
    // No length was specified, default to 50 pixel input box
	reqWidth += 50;
  }
  
  this.dlgItems.push([3, reqWidth, varAddr, 3, CStr(DSF.m,varAddr), prompt, len, priv]);
  this.activeItem = this.dlgItems.length - 1;
}

DialogManager.Render_dEDIT = function(index) {
  // Left hand prompt message
  this.dlgContext.fillStyle  = "#000000";
  this.dlgContext.fillText(this.dlgItems[index][5], 4, this.dlgRowHeight * index + 14);
  
  // Draw bounding box for text input area
  var dlgTxtOffsetX = this.dlgContext.measureText(this.dlgItems[index][5]).width + 12;
  
  var entryBoxWth = this.dlgInternalWidth - dlgTxtOffsetX;
  if (this.dlgItems[index][6] != -1) {
    entryBoxWth = Math.min(entryBoxWth, this.dlgItems[index][6]);
  }
  
  entryBoxWth = Math.min(entryBoxWth, this.dlgMaxEditBoxWidth);
  
  this.dlgContext.strokeStyle = "#A0A0A0";
  this.dlgContext.strokeRect(this.dlgInternalWidth - entryBoxWth - 3.5, this.dlgRowHeight * index + 1.5, entryBoxWth ,this.dlgRowHeight - 4);
  
  // Enter the text in the box
  if (this.dlgItems[index][7] == true)
  {
	// dXINPUT Password box
	var passText = "";
	for (var i = 0; i < this.dlgItems[index][4].length; i++)
	{
		passText+="*";
	}
    this.dlgContext.fillText(passText, this.dlgInternalWidth - entryBoxWth + 2, this.dlgRowHeight * index + 14, entryBoxWth - 8);
  }
  else
  {
    // Regular dEDIT
    this.dlgContext.fillText(this.dlgItems[index][4], this.dlgInternalWidth - entryBoxWth + 2, this.dlgRowHeight * index + 14, entryBoxWth - 8);
  }
}

DialogManager.dFLOAT = function(varAddr, prompt, min, max) {
  var reqWidth = this.dlgContext.measureText(prompt).width + this.dlgDefNumBoxWidth + 12;
  this.dlgItems.push([4, reqWidth, varAddr, 3, f64(DSF.m, varAddr), prompt, min, max]);
  this.activeItem = this.dlgItems.length - 1;
}

DialogManager.Render_dFLOAT = function(index) {
  // Left hand prompt message
  this.dlgContext.fillStyle  = "#000000";
  this.dlgContext.fillText(this.dlgItems[index][5], 4, this.dlgRowHeight * index + 14);
  
  // Draw bounding box for text input area
  var dlgTxtOffsetX = this.dlgContext.measureText(this.dlgItems[index][5]).width + 12;
  
  var entryBoxWth = this.dlgInternalWidth - dlgTxtOffsetX;
  entryBoxWth = Math.min(this.dlgMaxNumBoxWidth, entryBoxWth);
  
  this.dlgContext.strokeStyle = "#A0A0A0";
  this.dlgContext.strokeRect(this.dlgInternalWidth - entryBoxWth - 3.5, this.dlgRowHeight * index + 1.5, entryBoxWth ,this.dlgRowHeight - 4);
  
  // Enter the number in the box
  this.dlgContext.fillText(this.dlgItems[index][4], this.dlgInternalWidth - entryBoxWth + 2, this.dlgRowHeight * index + 14, entryBoxWth - 8);
}

DialogManager.dCHOICE = function(varAddr, prompt, values) {
  var reqWidth = this.dlgContext.measureText(prompt).width + this.dlgDefNumBoxWidth + 12;
  this.dlgItems.push([5, reqWidth, varAddr, 1, i16(DSF.m,varAddr), prompt, values]);
  this.activeItem = this.dlgItems.length - 1;
}

DialogManager.Render_dCHOICE = function(index) {
  // Left hand prompt message
  this.dlgContext.fillStyle  = "#000000";
  this.dlgContext.fillText(this.dlgItems[index][5], 4, this.dlgRowHeight * index + 14);
  
  // Draw bounding box for text input area
  var dlgTxtOffsetX = this.dlgContext.measureText(this.dlgItems[index][5]).width + 12;
  
  var entryBoxWth = this.dlgInternalWidth - dlgTxtOffsetX;
  entryBoxWth = Math.min(this.dlgMaxNumBoxWidth, entryBoxWth);
  
  this.dlgContext.strokeStyle = "#A0A0A0";
  this.dlgContext.strokeRect(this.dlgInternalWidth - entryBoxWth - 3.5, this.dlgRowHeight * index + 1.5, entryBoxWth ,this.dlgRowHeight - 4);
  
  // Render the text which is the currently selected item.
  var selectedItem = this.dlgItems[index][4];
  this.dlgContext.fillText(this.dlgItems[index][6].split(',')[selectedItem], this.dlgInternalWidth - entryBoxWth + 2, this.dlgRowHeight * index + 14, entryBoxWth - 8);
}

DialogManager.DIALOG = function() {
  // Render the dialog
  
  this.dlgActive = true;
}