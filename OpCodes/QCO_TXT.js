// Text and string manipulation

opCodeFuncs.push(

[0x14, function() {
  var arg = Stack.pps();
    
  var res = arg.length;
  wO('0x57 -> 0x14: LEN(' + arg + ') = "' + res + '"');
      
  // Push the value to the stack
  Stack.pi16(res);
}, 0x57],

[0xC0, function() {
  var arg = Stack.ppi16();
    
  // Convert to a string.
  var res = String.fromCharCode(arg);
  wO('0x57 -> 0xC0: CHR$(' + arg + ') = "' + res + '"');
      
  // Push the value to the stack
  Stack.ps(res);
}, 0x57],

[0xC5, function() {
  var arg1 = Stack.ppi16();
  var arg2 = Stack.ppi16();
  var arg3 = Stack.ppf64();
  
  var res = arg3.toFixed(arg2);
  
  // Convert to a string.
  res = "" + res;
  
  if (arg1 < 0) {
    arg1 = -arg1;
	
	if (res.length < arg1)
	{
      // Pad
	  var pad = '';
	  for (var i=0; i< arg1 - res.length; i++) {
	    pad += ' ';
	  }
  	res = pad + res;
	}
  }
  
  if (res.length > arg1)
  {
    // Fill with asterisks
	for (var i=0; i<res.length; i++) {
	  res[i] = '*';
	}
  } 
  
  wO('0x57 -> 0xC5: FIX$(' + arg3 + ', ' + arg2 + ', ' + arg1 +') = "' + res + '"');
      
  // Push the value to the stack
  Stack.ps(res);
}, 0x57],

[0xC6, function() {
  var arg1 = Stack.ppi16();
  var arg2 = Stack.ppf64();
  
  var res = arg2.toFixed(arg1);
  
  // Convert to a string.
  res = "" + res;
  
  wO('0x57 -> 0xC5: GEN$(' + arg2 + ', ' + arg1 + ') = "' + res + '"');
      
  // Push the value to the stack
  Stack.ps(res);
}, 0x57],

[0xCC, function() {
  var argY = Stack.ppi16();
  var argX = Stack.ppi16();
  var argS = Stack.pps();
  wO('0x57 -> 0xCC: MID$(' + argS + ', ' + argX + ', ' + argY + ')');
  
  Stack.ps(argS.substring(argX - 1, argY));
}, 0x57],

[0xD0, function() {
  var arg1 = Stack.ppi16();
  var arg2 = Stack.pps();
  var nStr = "";
  for (var i=0; i<arg1; i++) {
    nStr+=arg2;
  }
  wO('0x57 0xD0: REPT$ "' + arg2 + '", ' + arg1 + ' = "' + nStr + '"');
  Stack.ps(nStr);
}, 0x57]
);