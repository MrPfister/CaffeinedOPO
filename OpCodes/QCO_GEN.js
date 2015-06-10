// General and Error Operators

opCodeFuncs.push(

[0xBB, function() {
  wO('0xBB STOP');
  
  // Set RunState (rS) to 0
  rS = 0;
}],

[0xF0, function() {
  var arg = pB[++pc];
  if (arg == 0) {
    wO('0xF0 BUSY OFF - Todo');
  } else {
    wO('0xF0 BUSY ON - Todo');
  }
}],

[0x07, function() {
  wO('0x57 -> 0x07: ERR');
  Stack.pi16(ErrorHandler.Last);
}, 0x57],

[0x38, function() {
  var arg = pB[++pc];
  wO('0x57 -> 0x38: ALERT ' + arg);
}, 0x57],

[0xC4, function() {
  var arg = Stack.ppi16();
  var errStr = ErrorHandler.GetErrorText(arg);
  wO('0x57 -> 0xC4: ERR$(' + arg + ') = ' + errStr);
  
  Stack.ps(errStr);
}, 0x57],

[0x0E, function() {
  var arg = pB[++pc];
  
  if (arg == 0) {
    wO('0xFF -> 0x0E: CACHE OFF - Ignored');
  } else if (arg == 1) {
    wO('0xFF -> 0x0E: CACHE ON - Ignored');
  } else {
    Stack.ppd();
	Stack.ppd();
    wO('0xFF -> 0x0E: CACHE ON - Ignored');
  }
}, 0xFF]

);