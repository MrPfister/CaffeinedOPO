var ErrorHandler = {
  ErrorValues: [
   [-1, 'General failure'],
   [-2, 'Invalid arguments'],
   [-3, 'O/S error'],
   [-4, 'Service not supported'],
   [-5, 'Underflow (number too small)'],
   [-6, 'Overflow (number too large)'],
   [-7, 'Out of range'],
   [-8, 'Divide by zero'],
   [-9, 'In use'],
   [-10, 'No system memory'],
   [-11, 'Segment table full'],
   [-12, 'Semaphore table full'],
   [-13, 'Process table full/Too many processes'],
   [-14, 'Resource already open'],
   [-15, 'Resource not open'],
   [-16, 'Invalid image/device file'],
   [-17, 'No receiver'],
   [-18, 'Device table full'],
   [-19, 'File system not found'],
   [-20, 'Failed to start'],
   [-21, 'Font not loaded'],
   [-22, 'Too wide (dialogs)'],
   [-23, 'Too many items (dialogs)'],
   [-24, 'Batteries too low for digital audio'],
   [-25, 'Batteries too low to write to Flash'],
   
   [-99, 'Procedure not found']
  ],
  
  
  HandlerOffset: -1,
  
  Last: 0
};

ErrorHandler.Raise = function(err) {
  this.Last = err;
  wO('An Error has occured: ' + err + ' - ' + this.GetErrorText(err));
  
  if (this.HandlerOffset == -1) {
    // No error handler.
	rS = -1;
  } else {
    // Errors are being handled
	wO('Shifting execution to Error Handler');
  }
}

ErrorHandler.GetErrorText = function(err) {
  for (var i=0; i< this.ErrorValues.length; i++) {
    if (this.ErrorValues[i][0] == err) {
	  return this.ErrorValues[i][1];
	}
  }
  
  return 'Unknown Error';
}