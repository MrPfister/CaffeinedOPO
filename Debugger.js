var Debugger = {
  debugCanvas: null,
  debugContext: null,
  debugRenderImage: null,
  zoomSize: 2
};

Debugger.VisualiseMemory = function() {

  if (this.debugCanvas == null) {
    this.debugCanvas = document.createElement('canvas');
    this.debugCanvas.height= 256 * this.zoomSize;
    this.debugCanvas.width= 256 * this.zoomSize;
  
    document.write('<br />');
    document.write('<b>Memory Allocation Layout:</b><br />');
    document.write('<br />');
    document.body.appendChild(this.debugCanvas);
    document.write('<br />');
    
    this.debugContext = this.debugCanvas.getContext('2d');
    this.debugRenderImage = this.debugContext.createImageData(256 * this.zoomSize, 256 * this.zoomSize);
  }

  
  // Iterate through the memory and show it.
  for (var i = 0; i< DSF.c.length; i++) {
    for (var j = 0; j< DSF.c[i][1]; j++) {
      // Iterate through the length of the memory segment
      var y = Math.floor((DSF.c[i][2] + j) / 256);
      var x = Math.floor((DSF.c[i][2] + j) % 256);
      var dRI = (y * 256 * this.zoomSize * this.zoomSize + x * this.zoomSize) * 4;
      
      if (DSF.c[i][0] == 0) {
        // Not allocated
        for (var iy = 0; iy < this.zoomSize; iy++) {
          for (var ix = 0; ix < this.zoomSize; ix++) {
          
            this.debugRenderImage.data[dRI + (iy * 1024 * this.zoomSize) + ix * 4] = 0;
            this.debugRenderImage.data[dRI + (iy * 1024 * this.zoomSize) + ix * 4 + 1] = 255;
            this.debugRenderImage.data[dRI + (iy * 1024 * this.zoomSize) + ix * 4 + 2] = 0;
            this.debugRenderImage.data[dRI + (iy * 1024 * this.zoomSize) + ix * 4 + 3] = 255;
          }
        }
      } else {
        // Allocated
        for (var iy = 0; iy< this.zoomSize; iy++) {
          for (var ix = 0; ix< this.zoomSize; ix++) {
            this.debugRenderImage.data[dRI + (iy * 1024 * this.zoomSize) + ix * 4 + 1] = 0;
            this.debugRenderImage.data[dRI + (iy * 1024 * this.zoomSize) + ix * 4 + 2] = 0;
            this.debugRenderImage.data[dRI + (iy * 1024 * this.zoomSize) + ix * 4 + 3] = 255;
            if (DSF.c[i][3] == 1) {
				// Global
              this.debugRenderImage.data[dRI + (iy * 1024 * this.zoomSize) + ix * 4] = 0;
            } else if (DSF.c[i][3] == 2) {
				// Procedure
              this.debugRenderImage.data[dRI + (iy * 1024 * this.zoomSize) + ix * 4] = 128;
            } else if (DSF.c[i][3] == 3) {
				// Dynamic
              this.debugRenderImage.data[dRI + (iy * 1024 * this.zoomSize) + ix * 4] = 255;
            }
			else
			{
		      // Stack
              this.debugRenderImage.data[dRI + (iy * 1024 * this.zoomSize) + ix * 4] = 128;
              this.debugRenderImage.data[dRI + (iy * 1024 * this.zoomSize) + ix * 4 + 1] = 0;
              this.debugRenderImage.data[dRI + (iy * 1024 * this.zoomSize) + ix * 4 + 2] = 128;
			}
            
          }
        }
      }
    }
  }
  
  this.debugContext.putImageData(this.debugRenderImage, 0, 0);
};