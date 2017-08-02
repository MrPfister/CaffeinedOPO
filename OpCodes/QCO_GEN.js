// General and Error Operators

opCodeFuncs.push(

[0x6B, function() {
  wO('0x6B @ Operator');
  var arg = pB[++pc];
  var argT = pB[++pc];
  wO(' - Arguments: ' + arg);
  wO(' - Return Type: ' + argT);
  
  var argParams = [];
  for (var j = 0; j < arg; j++) {
    // Iterate through the arguments to pass through
	var i = Stack.ppi16();
	argParams.push(i);
    switch (t[i]) {
	case 0:
	  argParams.push(Stack.ppi16());
	  break;
	case 1:
	  argParams.push(Stack.ppi32());
	  break;
	case 2:
	  argParams.push(Stack.ppf64());
	  break;
	case 3:
	  argParams.push(Stack.pps());
	  break;
	case 4:
	  argParams.push(Stack.ppu16());
	  break;
    }
  }
  
  // Retrieve the name of the function.
  var argProcName = Stack.pps();
  wO(' - Procedure Name: ' + argProcName);
  
  // Determine the Proc Index
  for (var i=0; i< pList.length; i++)
  {
	  if (strcmp(pList[i].n, argProcName) == 0)
	  {
		  wO(' - Procedure Found at Index: ' + i);
		  cpW = i;
	  }
  }
  
  // Re-add the callee arguments.
  for (var i = 0; i < arg; i++)
  {
	  Stack.pt(argParams.pop(), argParams.pop());
  }
  
  if (cpW == -1)
  {
	  wO('Error: Callee Procedure not found!');
  }
}],

[0xA0, function() {
  wO('0xA0 BEEP - Ignore');
  Stack.ppd();
  Stack.ppd();
}],

[0xB5, function() {
  var arg = Stack.ppi16();
  wO('0xB5 PAUSE - Todo');
  
  if (arg == 0)
  {
	  // Wait until key is pressed
  }
  else if (arg > 0)
  {
	  // Wait (arg / 20) seconds
	  pW = arg * 50;
  }
  else if (arg < 0)
  {
      lastKeyPress = 0;
	  // Wait (arg / 20) seconds or until key is pressed
	  pW = -arg * 50;
	  rS = 3; // Pause awaiting keypress state.
  }
  
}],

[0xBB, function() {
  wO('0xBB STOP');
  
  // Set RunState (rS) to 0
  rS = 0;
}],

[0xBC, function() {
  wO('0xBC TRAP - Todo');
}],

[0xEF, function() {
  wO('0xEF STATUSWIN Nx - Ignored');
  var arg = pB[++pc];
  
  for (var i = 0; i < arg; i++)
  {
	  Stack.ppd();
  }
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

[0x0A, function() {
  wO('0x57 -> 0x0A: GET - Todo');
  Stack.pi16(0);
}, 0x57],

[0x35, function() {
  var arg = pB[++pc];
  wO('0x57 -> 0x35: OS - Ignored');

  for (var i = 0; i < arg; i++)
  {
	  Stack.ppd();
  }
  
  Stack.pi16(0);
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

[0xD6, function() {
  var arg = Stack.ppi16();
  wO('0x57 -> 0xD6: CMD$(' + arg + ') - TODO');
  
  if (arg == 1)
  {
	  // Full Path name used to start the program
	  Stack.ps("M:/")
  }
  else if (arg == 2)
  {
	  // Full Path name of the file to be used by the application
	  Stack.ps("M:/")
  }
  else if (arg == 3)
  {
	  // How the application was launched: C(Create), O(Open), R(5 Series)
	  Stack.ps("C");
  }
  else if (arg == 4)
  {
	  // Alias Information
	  Stack.ps("")
  }
  else if (arg == 5)
  {
	  // App name
	  Stack.ps("")
  }
  else
  {
	  // Invalid arguments
	  ErrorHandler.Raise(-2);
  }
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