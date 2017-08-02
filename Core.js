// Run State 3 = Paused(KeyPress), 2 = Go, 1 = Paused,  0 = Stop, -1 = Error
var rS = 2;

// Executable list
var eList = [];

// Procedure Stack
var pS = [];

// Call and return from procedure index flags
var cpW = -1, rpW = -1;

// Pause Waiting flag
var pW = 0;

// Procedure Offset
var pc = 0;

// Procedure DSF Offset
var pdsf = 0;

// Cache the bytes of the procedure being run
var pB = [];

// Create the Data Stack Frame with 64K memory
var DSF = new Mem(1024 * 64);

// Program Flags
var gUPDATEON = 1;

var opCodeFuncs = [];

var calcMem = 0;

// Stores wO values
var debugWin = null; 
var debugMsgs = [];
var debugMsgMax = 50;

var stackWin = null;

// Keypress information
var lastKeyPress = 0;

// Initialiser
function init() {
  document.write('Psion OPO Runtime<br />');
  document.write('Created by Kevin Pfister<br />');
  document.write('<br />');
  
  // Memory Test code
  //DSF.set(0, cf64(3.141592653));
  //document.write(f64(DSF.m, 0));
  //return;
    
  // Push the initial graphical window.
  Renderer.Init();
  Renderer.gCREATE(0, 0, 640, 240, 1, 4);
  
  debugWin = document.createElement('div');
  stackWin = document.createElement('div');
  
  document.write('<br /><br />');
  document.body.appendChild(debugWin);
  debugWin.width = 640;
  debugWin.height = 480;
  
  
  // Add an event listener for keypresses
  document.addEventListener( "keypress", doKeyDown, false )
  
  // Load and store the executable
  eList.push(new exe(Hex2Bytes(strap3)));
  
  // Visualise the memory
  Debugger.VisualiseMemory();
  
  document.write('<br /><b>Stack Contents:</b><br />');
  document.body.appendChild(stackWin);
  stackWin.width = 640;
  stackWin.height = 480;
  
  // Unknown opcodes
  document.write('<br /><br />');
  document.write('<b>Unknown Opcodes:</b><br />');
  
  // Call the first procedure in the file
  CProc(0);
  
  // Allocate memory to the virtual Calculator register
  calcMem = DSF.alloc(8);
  
  // Begin processing opcodes
  pOp();
}

function doKeyDown(e) {
  if (DialogManager.dlgActive) {
    wO(' Key Pressed: ' + e.keyCode);
    DialogManager.ProcessKey(e.keyCode);
  } else {
    wO(' Key Pressed: ' + e.keyCode);
	lastKeyPress = e.KeyCode;
  }
}

// Process Opcodes
function pOp() {
  // while (rS == 2 && !DialogManager.dlgActive ) {
  if (rS == 2 && !DialogManager.dlgActive ) {
    pNOp();
	
	// Render the screen.
	Renderer.Composite(false);
	DialogManager.Composite();
	Stack.visualise();
    
    if (cpW != -1) {
    	// Calling Procedure
    	CProc(cpW);
    }
    
    if (rpW != -1) {
      RProc();
    }
    
    if (pS.length != 0 && pc >= pS[pS.length-1].p.q) {
      
      wO('Reached the end of the procedure');
      RProc();
    }
  }
  
  // Visualise the memory
  Debugger.VisualiseMemory();
  
  if (rS == 1 || DialogManager.dlgActive) {
    // Internal Pause state
    setTimeout(pOp,500);
	return;
  } else if (rS == 2) {
    // Running state
	if (pW > 0)
	{
	  // Pause for a certain time period
      setTimeout(pOp, pW);
	  pW = 0;
	}
	else
	{
      setTimeout(pOp, 100);
	}
	return;
  } else if (rS == 3) {
    // Paused state, awaiting keypress
	if (lastKeyPress != 0)
	{
		// Key has been pressed.
		rS = 2;
		pW = 0; // Cancel any pause state.
		lastKeyPress = 0;
	}
	
	if (pW > 0)
	{
		// The system was in a pause awaiting a keypress.
		pW -= 10;
		if (pW<=0)
		{
			pW = 0;
			rS = 2; // Return to running.
		}
	}
	
    setTimeout(pOp, 10);
  }
  
  // rS = 0
  wO('Application has terminated');
}

// Process next available OpCode
function pNOp() {
  var op = pB[pc];
  var args = 0;
  
  switch (op) {    

    case 0x53:
      wO('0x53: Call PROC EE');
      
      var rc = i16(pB, pc + 1);
      wO('* Call Procedure, Reference: ' + rc);
    
      pc += 2;
      cpW = getCPI(rc);
	  if (cpW == -1) {
	    // Unable to find correct CPW
        ErrorHandler.Raise(-99);
	  } else {
        wO('* Procedure CPI Reference: ' + cpW);
	  }
      break;
    case 0x57:
      pc++;
      pNOp57();
      break;
    case 0x5B:
      var IFarg = Stack.ppi16();
      var IFjmp = i16(pB, pc + 1);
      
      wO('0x5B: IF ' + IFarg + ' == 0 THEN GOTO +' + IFjmp);
      if (IFarg == 0) {
        pc += IFjmp - 1;
        wO(' * IF condition successful');
      } else {
        pc+=2;
        wO(' * IF condition failed');
      }
      break;
    case 0x63:
      var val1 = Stack.ppi32();
      
      wO('0x63: push& VV%(' + val1 + ')');
      Stack.pi32(val1);
      break;
    case 0x74:
    case 0x75:
    case 0x76:
    case 0x77:
      wO('0x74 - 0x77: RETURN');
      rpW = 1;
      break;
    case 0x80:
    case 0x81:
    case 0x82:
    case 0x83:
		wO('0x80 - 0x83: POP and discard');
		Stack.ppd();
		break;
    case 0xA9:
      var arg = pB[++pc];
      wO('0xA9: ESCAPE ' + arg + ' - TODO');
      
      break;
    case 0xB1:
      var arg = u16(pB, pc + 1);
      
      ErrorHandler.HandlerOffset = pc + arg;
      wO('0xB1: ONERR jump to (' + ErrorHandler.HandlerOffset + ')');
      pc += 2;
      break; 
    case 0xBF:
      var arg = i16(pB, pc + 1);
      
      wO('0xBF: GOTO ' + arg);
      
      pc += arg - 1;
      break; 
    case 0xC0:
      wO('0xC0: RETURN POP+');
	  Stack.ppd();
      rpW = 1;
      break; 
    case 0xED:
      wO('0xED: Extended Dialog Box Commands');
      pc++;
      pNOpED();
      break;
    case 0xF1:
      var arg = pB[++pc];
      wO('0xF1: LOCK ' + arg + ' - TODO');
      break;
    case 0xFF:
      wO('0xFF: Extended Commands');
      pc++;
      pNOpFF();
      break;
    default:
	  // Check to see if it is in the OpCodeFuncs
	  var fnd = false;
      for (var i = 0; i < opCodeFuncs.length; i++) {
	    if (opCodeFuncs[i].length == 2) {
		  if (opCodeFuncs[i][0] == op) {
			opCodeFuncs[i][1]();
			fnd = true;
			break;
		  }
		}
      }
	  if (!fnd) {
        document.write('Opcode: ' + op + ' at Offset ' + pc + '<br />');
	  }
  }
  pc++;
}

function pNOp57() {
  var op = pB[pc];
  
  switch (op) {
    case 0x02:
      var arg = pB[++pc];
      
      wO('CALL ' + arg + ' arguments');
      w_CALL(arg);      
      break;
    default:
      // Check to see if it is in the OpCodeFuncs
	  var fnd = false;
      for (var i = 0; i < opCodeFuncs.length; i++) {
	    if (opCodeFuncs[i].length == 3) {
		  if (opCodeFuncs[i][0] == op && opCodeFuncs[i][2] == 0x57) {
			opCodeFuncs[i][1]();
			fnd = true;
			break;
		  }
		}
      }
	  if (!fnd) {
	    document.write('Opcode: 0x57 -> ' + op + ' at Offset ' + pc + '<br />');
	  }
  }
}

function pNOpED() {
  // These are for Extended Dialog Box Commands
  var op = pB[pc];
  
  // Check to see if it is in the OpCodeFuncs
  var fnd = false;
  for (var i = 0; i < opCodeFuncs.length; i++) {
    if (opCodeFuncs[i].length == 3) {
      if (opCodeFuncs[i][0] == op && opCodeFuncs[i][2] == 0xED) {
        opCodeFuncs[i][1]();
        fnd = true;
        break;
      }
    }
  }
  if (!fnd) {
	document.write('Opcode: 0xED -> ' + op + ' at Offset ' + pc + '<br />');
  }
}

function pNOpFF() {
  // These are for Extended Dialog Box Commands
  var op = pB[pc];
  
  // Check to see if it is in the OpCodeFuncs
  var fnd = false;
  for (var i = 0; i < opCodeFuncs.length; i++) {
    if (opCodeFuncs[i].length == 3) {
      if (opCodeFuncs[i][0] == op && opCodeFuncs[i][2] == 0xFF) {
        opCodeFuncs[i][1]();
        fnd = true;
        break;
      }
    }
  }
  if (!fnd) {
	document.write('Opcode: 0xFF -> ' + op + ' at Offset ' + pc + '<br />');
  }
}

// Get the index of an externally referenced procedure
function getCPI(ee) {
  var CPn = getEEn(ee);
  
  wO('EE value of ' + ee + ' corresponds to ' + CPn);
  
  for (var i = 0; i < pList.length; i++) {
    if (strcmp(pList[i].n, CPn) == 0) {
      return i;
    }
  }
  
  return -1;
}

// Get the name of an externally referenced variable or proc
function getEEn(ee) {
  
  var tP = pS[pS.length - 1].p;
  var pID = tP.n;
  wO(' * Get the procedure ID of the running PROC ' + pID);
  
  
  wO(' * Check Global Variables defined in the Procedure');
  var EEo = getEEo(ee, tP.gvs);
  if (EEo) {return EEo.n;}
  
  
  wO(' * Check Called Procedures');
  EEo = getEEo(ee, tP.cp);
  if (EEo) {return EEo.n;}
  
  
  wO(' * Check Global Variables Referenced');
  EEo = getEEo(ee, tP.gr);
  if (EEo) {return EEo.n;}
  
  wO(' * ERROR: EE Reference not found!');
  return "";
}

// Returns the object which corresponds to an EE index if found
function getEEo(ee, a) {
  if (a.length > 0) {
    wO('Minimum EE val: ' + a[0].EEi);
  } else {
    wO('No values to query EE');
  }

  for (var i = 0; i < a.length; i++) {
  	wO(' * EE [' + a[i].n + '] : ' + a[i].EEi);
    if (a[i].EEi == ee) {
      return a[i];
    }
  }
}

// Return the type of an External
function getEEt(ee) {
  wO(' * Get the procedure ID of the running PROC');
  var tP = pS[pS.length - 1].p;
  
  wO(' * Check Global Variables defined in the Procedure');
  if (getEEo(ee, tP.gvs)) {return 0}
  
  
  wO(' * Check Called Procedures');
  if (getEEo(ee, tP.cp)) {return 1}
  
  
  wO(' * Check Global Variables Referenced');
  if (getEEo(ee, tP.gr)) {return 2}
  
  wO(' * ERROR: EE Reference not found!');
  
  // Stop Execution
  rS = 0;
}

// Return the value of an External
function getEEv(ee) {
  wO(' * Get the procedure ID of the running PROC');
  var tP = pS[pS.length - 1].p;
  var pID = tP.i;
  
  wO(' * Check Global Variables defined in the Procedure');
  var EEo = getEEo(ee, tP.gvs);
  if (EEo) {
    wO(' EE value references a declared global variable: ' + EEo.n);
	// Return a value based on the type
    return getEEoV(EEo);
  }
  
  wO(' * Check Global Variables Referenced');
  EEo = getEEo(ee, tP.gr);
  if (EEo) {
    wO(' EE value references a referenced global variable: ' + EEo.n);
    
    // Return a value based on the type
    return getEEoV(EEo);
  }
  
  wO(' * ERROR: EE Reference not found!');
  
  // Stop Execution
  rS = 0;
}

function getEEa(ee) {
  wO(' * Get the procedure ID of the running PROC');
  var tP = pS[pS.length - 1].p;
  var pID = tP.i;
  
  wO(' * Check Global Variables defined in the Procedure');
  var EEo = getEEo(ee, tP.gvs);
  if (EEo) {
    wO(' EE value references a declared global variable: ' + EEo.n);
	// Return a value based on the type
    return EEo.d;
  }
  
  wO(' * Check Global Variables Referenced');
  EEo = getEEo(ee, tP.gr);
  if (EEo) {
    wO(' EE value references a referenced global variable: ' + EEo.n);
    
    // Return a value based on the type
    return EEo.d;
  }
  
  wO(' * ERROR: EE Reference not found!');
  
  // Stop Execution
  rS = 0;
}

function getEEoV(EEo) {
  if (EEo.t == 0) {
    return i16(DSF.m, EEo.d);
  } else if (EEo.t == 1) {
    return i32(DSF.m, EEo.d);
  } else if (EEo.t == 2) {
	return f64(DSF.m, EEo.d);
  } else if (EEo.t == 3) {
  	// String (Offset 0 is the max string length)
  	return CStr(DSF.m, EEo.d + 1);
  }
}

// Return the value type of an External
function getEEvt(ee) {
  var tP = pS[pS.length - 1].p;
  var pID = pS[pS.length - 1].i;
  wO(' * Get the procedure ID of the running PROC [' + pID + ']');
  
  wO(' * GVS: ' + tP.gvs.length);
  wO(' * CP: ' + tP.cp.length);
  wO(' * P: ' + tP.p.length);
  wO(' * GR: ' + tP.gr.length);
  
  if (tP.gvs.length > 0)
  {
    wO('Query EE value references in declared global variables');
    var EEo = getEEo(ee, tP.gvs);
    if (EEo) {
      wO(' EE value references a declared global variable: ' + EEo.n);
	  return EEo.t;
    }
  }
  
  if (tP.p.length > 0)
  {
    wO('Query EE value references in Parameters');
    EEo = getEEo(ee, tP.p);
    if (EEo) {
      wO(' EE value references a Parameter: ' + EEo.n);
	  return EEo.t;
    } 
  }
  
  if (tP.gr.length > 0)
  {
    wO('Query EE value references in referenced global variables');
    EEo = getEEo(ee, tP.gr);
    if (EEo) {
      wO(' EE value references a referenced global variable: ' + EEo.n);
	  return EEo.t;
    }  
  }
  
  wO(' * ERROR: EE Reference (' + ee + ') not found!');
  
  // Stop Execution
  rS = 0;
}

// Call Procedure
function CProc(i) {
  wO('Calling Procedure: ' + pList[i].n + ':');
  
  // Clear the Call Procedure Waiting Flag
  cpW = -1;
  
  if (pS.length == 255) {
    ErrorHandler.Raise(-13);
	return;
  }
  
  // Procedure Stack Item
  var psi = new Object();
  
  // Store Index
  psi.i = i;
  psi.pc = pc;
  
  // Store a link to the procedure Object
  psi.p = pList[i];
  
  // Store the offset to the DSF proc cache
  psi.pdsf = pdsf;
  
  wO('QCode Length of PROC: ' + psi.p.q);
  
  pS.push(psi);
  
  // Reset Application counter
  pc = 0;
  
  // Cache QCode
  pB = pS[pS.length - 1].p.qc;
  
  // Alloc space and save the link to the DSF position for the procedure
  pdsf = DSF.alloc(pList[i].d, 2);
  
  // Go through and initialise space for variables.
  wO('Initialising procedure variables: ');
  for (var i = 0; i< psi.p.ac.length; i++) {
  	wO('Initialising array - Offset: ' + (pdsf + psi.p.ac[i].dso) + ' Size: ' + psi.p.ac[i].s);
	if (psi.p.ac[i].s < 255)
	{
		DSF.set((pdsf + psi.p.ac[i].dso), [0, psi.p.ac[i].s]);
	}
	else
	{
		// Todo: Fix for 16bit values (greater than 255)
		DSF.set((pdsf + psi.p.ac[i].dso), [psi.p.ac[i].s,0]);
	}
  }
  for (var i = 0; i< psi.p.sc.length; i++) {
  	wO('Initialising string - Offset: ' + (pdsf + psi.p.sc[i].dso) + ' Size: ' + psi.p.sc[i].s );
  	DSF.set((pdsf + psi.p.sc[i].dso), [psi.p.sc[i].s, 0]);
  }
  
  // Visualise the memory
  Debugger.VisualiseMemory();
}

// Return from a procedure
function RProc() {
  DSF.dealloc(pdsf);
  
  // Cancel error handling
  ErrorHandler.HandlerOffset = -1;
  
  if (pS.length == 0) {
    rS = 0;
    wO('Proc Stack is now empty - Terminating execution.');
  } else {
  	pc = pS[pS.length - 1].pc;
  	pB = pS[pS.length - 1].p.qc;
    pdsf = pS[pS.length - 1].pdsf;
    wO('Returning control to PROC ' + pS[pS.length - 1].p.n + ':');
	wO(' - Executing from: ' + pc);
	pS.pop();
  }
  // Reset the Return Procedure Waiting flag
  rpW = -1;
}

// Write output to chosen method
function  wO(m) {
  debugMsgs.push(m);
  
  if (debugMsgs.length > debugMsgMax) {
    debugMsgs.shift();
  }

  if (debugWin != null) {
    var debugTxt = '';
    for(var i=0; i< debugMsgs.length; i++) {
      debugTxt += debugMsgs[i] + '<br />';
    }
    debugWin.innerHTML = debugTxt;
  }
}