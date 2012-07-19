// Run State 2 = Go, 1 = Paused,  0 = Stop, -1 = Error
var rS = 2;

// Executable list
var eList = [];

// Procedure Stack
var pS = [];

// Call and return from procedure index flags
var cpW = -1, rpW = -1;

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

// Initialiser
function init() {
  // Load and store the executable
  eList.push(new exe(Hex2Bytes(strap1)));
  
  // Call the first procedure in the file
  CProc(0);
  
  // Push the initial graphical window.
  gWIN.push(new gCREATE());
  
  // Begin processing opcodes
  pOp();
}

// Process Opcodes
function pOp() {
  while (rS == 2) {
    pNOp();
    
    if (cpW != -1) {
    	// Calling Procedure
    	CProc(cpW);
    }
    
    if (pc >= pS[pS.length-1].p.q) {
      
  wO('Reached the end of the procedure');
      RProc();
    }
  };
  
  if (rS == 1) {
    // Internal Pause
    setTimeout('pOp()',500);
  }
  
  
  wO('Application has terminated');
}

// Process next available OpCode
function pNOp() {
  var op = pB[pc];
  var args = 0;
  
  switch (op) {
    // 0x00 - 0x03 PUSH+ the value of LL+
    case 0x00:
      // Get the Address
      var LL = pdsf + u16(pB, pc + 1);
      
      // Get the Value
      var val = i16(DSF.m, LL);
      wO('0x00: PUSH+ the value(' + val + ') of LL+(' + LL + ') i16');
      
      // Push the value to the stack
      pi16(val);
      
      pc += 2;
      break;
    case 0x01:
      // Get the Address
      var LL = pdsf + u16(pB, pc + 1);
      
      // Get the Value
      var val = i32(DSF.m, LL);
      wO('0x01: PUSH+ the value (' + val + ') of LL+(' + LL + ') i32');
      
      // Push the value to the stack
      pi32(val);
      
      pc += 2;
      break;
    case 0x02:
      // TODO
    case 0x03:
      // Get the Address
      var LL = pdsf + u16(pB, pc + 1);
      
      // Get the Value
      var val = CStr(pB, LL);
      wO('0x03: PUSH+ the value of LL+(' + LL + ') String: "' + val + '"');
      
      // Push the value to the stack
      // TODO
      
      pc += 2;
      break;
    
    // 0x04 - 0x07 PUSH+ the address of LL+
    case 0x04:
    case 0x05:
    case 0x06:
    case 0x07:
      var LL = pdsf + u16(pB, pc + 1);
      wO('0x04 - 0x07: PUSH+ the address of LL+(' + LL + ')');
      pu16(LL);
      pc += 2;
      break;
    // 0x08 - 0x0B PUSH+ the value of EE+ 
    case 0x08:
    case 0x09:
    case 0x0A:
    case 0x0B:
      
      var EE = u16(pB, pc + 1);
      wO('0x08 - 0x0B: PUSH+ the value of EE+(' + EE + ') - TODO');
      pc += 2;
        
      // TODO
      
      break;
      
    // 0x0C - 0x0F PUSH+ the address of EE+
    case 0x0C:
    case 0x0D:
    case 0x0E:
    case 0x0F:
      var EEn = getEEn(i16(pB, pc + 1));
      wO('0x0C - 0x0F PUSH+ the address of EE+(' + EEn + ') - TODO');
      pc += 2;
      
      if (strcmp(EEn, '') != 0) {
        wO('ER_FN_BA');
        return;
      }
      
      // Get the address of the global
      getEEv(EEn);
      break;
    case 0x10:
      var LL = pdsf + u16(pB, pc + 1);
      pc++;
      var FV = ppi16();
      LL+= FV * 2 - 2;
      pi16(i16(DSF.m, LL));
      wO('0x10: PUSH+ the value(' + i16(DSF.m, LL) + ') of LL+(' + LL + ') FF(' + FV + ')');
    case 0x12:
      var LL = pdsf + ppu16();
      var val = i16(DSF.m, LL);
      wO('0x12: PUSH+ the value(' + val + ') of LL+(' + LL + ')');
      pi16(val);
      break;
    case 0x14:
      var LL = pdsf + u16(pB, pc + 1);
      pc += 2;
      var FV = ppi16();
      LL+= FV * 2 - 2;
      pi16(LL);
      
      wO('0x14: PUSH= the address(' + LL + ') of LL+(' + FV + ') - TODO');
      break;
    // 0x28 - 0x2B PUSH+ VV+
    case 0x28:
      var vl = i16(pB, pc + 1);
      wO('0x28: PUSH+ VV+(' + vl + ')');
      pc+=2;
      pi16(vl);
      break;
    case 0x29:
      var vl = i32(pB, pc + 1);
      wO('0x29: PUSH+ VV+(' + vl + ')');
      pc+=4;
      pi32(vl);
      break;
    case 0x2B:
      var arg = CStr(pB, ++pc);
      wO('0x2B: PUSH$ "' + arg + '"');
      
      ps(arg);
      pc+= 1 + arg.length;
      
      break;
    case 0x30:
      var arg1 = ppi16();
      var arg2 = ppi16();
      
      wO('0x30: push(i16) ' + arg2 + ' < ' + arg1);
      
      if (arg1 > arg2) {
        pi16(-1);
      } else {
        pi16(0);
      }
      break;
    case 0x31:
      var arg1 = ppi32();
      var arg2 = ppi32();
      
      wO('0x31: push(i32) ' + arg2 + ' < ' + arg1);
      
      if (arg1 > arg2) {
        pi32(-1);
      } else {
        pi32(0);
      }
      break;
    case 0x3D:
      var arg1 = ppi32();
      var arg2 = ppi32();
      wO('0x3D: push(i32) ' + arg2 + ' >= ' + arg1);
      if (arg2 >= arg1) {
        pi32(-1);
      } else {
        pi32(0);
      }
      break;
    case 0x48:
      var arg1 = ppi16();
      var arg2 = ppi16();
      
      wO('0x48: push(i16) ' + arg2 + ' + ' + arg1);
      pi16(arg2 + arg1);
      break;
    case 0x4C:
      var arg1 = ppi16();
      var arg2 = ppi16();
      
      wO('0x4C: push(i16) ' + arg2 + ' - ' + arg1);
      pi16(arg2 - arg1);
      break;
    case 0x4D:
      var arg1 = ppi32();
      var arg2 = ppi32();
      
      wO('0x4D: push(i32) ' + arg2 + ' - ' + arg1);
      pi32(arg2 - arg1);
      break;
    case 0x4F:
      // Convert a byte to an Int16
      var vl = pB[++pc];
      wO('0x4F: Push ' + vl + ' ($80 to $FF convert to $FF80 to $FFFF)');
      pi16(vl);
      break;
    case 0x53:
      wO('0x53: Call PROC EE');
      
      var rc = i16(pB, pc + 1);
      wO('Call Procedure, Reference: ' + rc);
    
      pc += 2;
      cpW = getCPI(rc);
      break;
    case 0x57:
      wO('0x57: Use extended function');
      pc++;
      pNOp57();
      
      break;
    case 0x5B:
      var IFarg = ppi16();
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
    case 0x61:
      var val1 = ppi32();
      var val2 = ppi32();
      
      var rc = val1 | val2;
      wO('0x61: PUSH& POP+2(' + val2 + ') | POP+1(' + val1 +')');
      pi32(rc);
      break;
    case 0x68:
      wO('0x68: PUSH% -POP+');
      pi16(-ppi16());
      break;
    case 0x69:
      wO('0x69: PUSH% -POP+');
      pi32(-ppi32());
      break;
    case 0x74:
    case 0x75:
    case 0x76:
    case 0x77:
      wO('0x74 - 0x77: RETURN');
      rpW = 1;
      break;
    case 0x7C:
      wO('0x7C: PUSH * value of POP% - TODO');
      var val = ppi16();
      
      // Push the value as a float
      break;
    case 0x7D:
      wO('0x7D: PUSH* value of POP& - TODO');
      
      // Push a double version of an Int32 variable
      
      pi32(ppi32());
      break;
    case 0x84:
    case 0x85:
    case 0x86:
      // Value
      var v = ppb();
      
      // Address
      var addr = ppu16();
      
      wO('0x84 - 0x86: Store [' + v + '] in location ' + addr + ' - TODO');
      
      // Store the value
      DSF.set(addr ,v);
      break;
    case 0xBF:
      var arg = i16(pB, pc + 1);
      
      wO('0xBF: GOTO ' + arg);
      
      pc += arg - 1;
      break; 
    case 0xCA:
      var arg = ppi16();
      wO('0xCA: gFONT ' + arg + ' - TODO');
      break;
    case 0xCE:
      var arg = ppi16();
      wO('0xCE: gSTYLE ' + arg + ' - TODO');
      break;
    case 0xD2:
      var y = ppi16();
      var x = ppi16();
      wO('0xBF: gAT(' + x + ', ' + y + ')');
      gWIN[gWIN.length - 1].gAT(x,y);
      break;
    case 0xD4:
      var arg1 = ppi16();
      wO('0xD4: gPRINT ' + arg1);
      break;
    case 0xE3:
      // gUPDATE
      var arg = pB[++pc];
      if (arg > 1) {
        // Update Graphics
        // TODO
      } else {
        gUPDATEON = arg;
      }
      
      break;
    case 0xED:
      wO('0xED: Extended Dialog Box Commands');
      pc++;
      pNOpED();
      break;
    default:
      wO('Opcode: ' + op + ' at Offset ' + pc);
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
    case 0x1C:
      wO('0x1C: SECOND - TODO');
      pi16(0);
      break;
    default:
      wO('Opcode: 0x57 ' + op + ' at Offset ' + pc);
  }
  
  //pc++;
}


function pNOpED() {
  // These are usually for Extended Dialog Box Commands
  var op = pB[pc];
  
  switch (op) {
    default:
      wO('Opcode: 0xED ' + op + ' at Offset ' + pc);
  }
  
  //pc++;
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
  
  wO('Get the procedure ID of the running PROC');
  var tP = pS[pS.length - 1].p;
  var pID = tP.i;
  
  
  wO(' * Check Global Variables defined in the Procedure');
  var EEo = getEEo(ee, tP.gvs);
  if (EEo) {return EEo.n;}
  
  
  wO(' * Check Called Procedures');
  EEo = getEEo(ee, tP.cp);
  if (EEo) {return EEo.n;}
  
  
  wO(' * Check Global Variables Referenced');
  EEo = getEEo(ee, tP.gr);
  if (EEo) {return EEo.n;}
  
  return "";
}

// Returns the object which corresponds to an EE index if found
function getEEo(ee, a) {
  var rc = null;
  
  for (var i = 0; i < a.length; i++) {
    if (a[i].EEi == ee) {
      return a[i];
    }
  }
}

// Return the type of an External
function getEEt(ee) {
  wO('Get the procedure ID of the running PROC');
  var tP = pS[pS.length - 1].p;
  var pID = tP.i;
  
  
  wO(' * Check Global Variables defined in the Procedure');
  var EEo = getEEo(ee, tP.gvs);
  if (EEo) {return 0}
  
  
  wO(' * Check Called Procedures');
  EEo = getEEo(ee, tP.cp);
  if (EEo) {return 1}
  
  
  wO(' * Check Global Variables Referenced');
  EEo = getEEo(ee, tP.gr);
  if (EEo) {return 2}
}

// Return the value of an External
function getEEv(ee) {
  wO('Get the procedure ID of the running PROC');
  var tP = pS[pS.length - 1].p;
  var pID = tP.i;
  
  wO(' * Check Global Variables defined in the Procedure');
  var EEo = getEEo(ee, tP.gvs);
  if (EEo) {
    wO(' EE value references a declared global variable');
  }
  
  wO(' * Check Global Variables Referenced');
  EEo = getEEo(ee, tP.gr);
  if (EEo) {
    wO(' EE value references a referenced global variable');
  }
}

// Call Procedure
function CProc(i) {
  wO('Calling Procedure: ' + pList[i].n);
  
  // Clear the Call Procedure Waiting Flag
  cpW = -1;
  
  // Save the procedure counter that was running
  if (pS.length > 0) {
    pS[pS.length - 1].pc = pc;
  }
  
  // Procedure Stack Item
  var psi = new Object();
  
  // Store Index
  psi.i = i;
  
  // Store a link to the procedure Object
  psi.p = pList[i];
  
  
  wO('QCode Length of PROC: ' + psi.p.q);
  
  pS.push(psi);
  
  // Reset Application counter
  pc = 0;
  
  // Cache QCode
  pB = pS[pS.length - 1].p.qc;
  
  // Alloc space and save the link to the DSF position for the procedure
  pdsf = DSF.alloc(pList[i].d);
  
  // Go through and initialise space for variables.
}

// Return from a procedure
function RProc() {
  // DSF.dealloc(pdsf);
  
  // Remove the top of the stack
  pS.pop();
  if (pS.length == 0) {
    rS = 0;
  } else {
  	pc = pS[pS.length - 1].pc;
  	pB = pS[pS.length - 1].p.qc;
  }
}

// Write output to chosen method
function   wO(m) {
    document.write('<br />' + m);
}
