opCodeFuncs.push(

[0x00, function() {
  // Get the Address
  var LL = pdsf + u16(pB, pc + 1);
      
  // Get the Value
  var val = i16(DSF.m, LL);
  wO('0x00: PUSH% the value(' + val + ') of LL+(' + LL + ') i16');
      
  // Push the value to the stack
  Stack.pi16(val);
      
  pc += 2;
}],

[0x01, function() {
  // Get the Address
  var LL = pdsf + u16(pB, pc + 1);
      
  // Get the Value
  var val = i32(DSF.m, LL);
  wO('0x01: PUSH& the value (' + val + ') of LL+(' + LL + ') i32');
      
  // Push the value to the stack
  Stack.pi32(val);
      
  pc += 2;
}],

[0x02, function() {
  // Get the Address
  var LL = pdsf + u16(pB, pc + 1);
      
  // Get the Value
  var val = f64(DSF.m, LL);
  wO('0x02: PUSH* the value (' + val + ') of LL+(' + LL + ') i32');
      
  // Push the value to the stack
  Stack.pf64(val);
      
  pc += 2;
}],

[0x03, function() {
  // Get the Address
  var LL = pdsf + u16(pB, pc + 1);
      
  // Get the Value
  var val = CStr(DSF.m, LL);
  wO('0x03: PUSH$ the value of LL+(' + LL + ') String - Max:' + DSF.peek(LL - 1) + ' Cur: ' + DSF.peek(LL) + ' Val: "' + val + '"');
      
  // Push the value to the stack
  Stack.ps(val);
      
  pc += 2;
}],

[0x04, function() { VAR_pADDR(); }],
[0x05, function() { VAR_pADDR(); }],
[0x06, function() { VAR_pADDR(); }],
[0x07, function() { VAR_pADDR(); }],

// 0x08 - 0x0B PUSH+ the value of EE+ 
[0x08, function() { VAR_pEE_Val(); }],
[0x09, function() { VAR_pEE_Val(); }],
[0x0A, function() { VAR_pEE_Val(); }],
[0x0B, function() { VAR_pEE_Val(); }],

// 0x0C - 0x0F PUSH+ the address of EE+
[0x0C, function() { VAR_pEE_ADDR(); }],
[0x0D, function() { VAR_pEE_ADDR(); }],
[0x0E, function() { VAR_pEE_ADDR(); }],
[0x0F, function() { VAR_pEE_ADDR(); }],

// 0x10 - 0x13 push+ the value of LL+(pop%)
[0x10, function() {
  // Get the array index
  var arg1 = Stack.ppi16();

  // Get the array address
  var LL = pdsf + u16(pB, pc + 1);
      
  // Get the Value based on array index
  var val = i16(DSF.m, LL + (arg1 - 1) * 2);
  wO('0x10: PUSH% the value(' + val + ') of LL+(' + LL + ') i16');
      
  // Push the value to the stack
  Stack.pi16(val);
      
  pc += 2;
}],
[0x11, function() {
  // Get the array index
  var arg1 = Stack.ppi16();

  // Get the array address
  var LL = pdsf + u16(pB, pc + 1);
      
  // Get the Value based on array index
  var val = i32(DSF.m, LL + (arg1 - 1) * 4);
  wO('0x11: PUSH& the value(' + val + ') of LL+(' + LL + ') i32');
      
  // Push the value to the stack
  Stack.pi32(val);
      
  pc += 2;
}],
[0x12, function() {
  // Get the array index
  var arg1 = Stack.ppi16();

  // Get the array address
  var LL = pdsf + u16(pB, pc + 1);
      
  // Get the Value based on array index
  var val = f64(DSF.m, LL + (arg1 - 1) * 4);
  wO('0x11: PUSH& the value(' + val + ') of LL+(' + LL + ') f64');
      
  // Push the value to the stack
  Stack.pf(val);
      
  pc += 2;
}],
[0x13, function() {
  // Get the array index
  var arg1 = Stack.ppi16();

  // Get the array address
  var LL = pdsf + u16(pB, pc + 1);
  
  // Get the length of each string
  var sL = DSF.m[LL - 1];
  wO('0x13: DEBUG: Array Length (' + DSF.m[LL - 2] + ')');
  wO('0x13: DEBUG: Max String Length (' + DSF.m[LL - 1] + ')');
  LL = LL + sL * (arg1 - 1);
  
  var val = CStr(DSF.m, LL);
  wO('0x13: PUSH$ the value(' + val + ') of String Array Index(' + arg1 + ') at Location (' + LL + ')');
  // Push the value to the stack
  Stack.ps(val);
  pc += 2;
}],

// 0x14 - 0x17 push= the address of LL+(pop%)
[0x14, function() { VAR_Arr_ADDR(2); }],
[0x15, function() { VAR_Arr_ADDR(4); }],
[0x16, function() { VAR_Arr_ADDR(8); }],
[0x17, function() {
  // Get the array index
  var arg1 = Stack.ppi16();

  // Get the array address
  var LL = pdsf + u16(pB, pc + 1); 
  wO('0x17: DEBUG: Array Length (' + DSF.m[LL - 2] + ')');
  wO('0x17: DEBUG: Max String Length (' + DSF.m[LL - 1] + ')');
  
  // Get the length of each string
  var sL = DSF.m[LL - 1];
  if (typeof sL === 'undefined') {
	  sL = 0;
  }
  
  LL = LL + sL * (arg1 - 1);
  wO('0x17: PUSH% the address(' + LL + ') of String Array Index(' + arg1 + ') with String Length (' + sL + ')');

  Stack.pu16(LL);
  pc += 2;
}],

// 0x28 - 0x2B PUSH+ VV+
[0x28, function() {
  var vl = i16(pB, pc + 1);
  wO('0x28: PUSH% VV%(' + vl + ')');
  pc+=2;
  Stack.pi16(vl);
}],
[0x29, function() {
  var vl = i32(pB, pc + 1);
  wO('0x29: PUSH& VV&(' + vl + ')');
  pc+=4;
  Stack.pi32(vl);
}],
[0x2A, function() {
  var vl = f64(pB, pc + 1);
  wO('0x29: PUSH* VV*(' + vl + ')');
  pc+=8;
  Stack.pf64(vl);
}],
[0x2B, function() {
  var arg = CStr(pB, ++pc);
  wO('0x2B: PUSH$ "' + arg + '"');
  Stack.ps(arg);
  pc+= arg.length;
}],    

[0x4F, function() {
  // Convert a byte to an Int16
  var vl = pB[++pc];
  wO('0x4F: Push ' + vl + ' (Byte to Int16 Conversion)');
  Stack.pi16(vl);
}],

[0x78, function() { VAR_CONV(1, 0); }],
[0x79, function() { VAR_CONV(2, 0); }],
[0x7A, function() { VAR_CONV(2, 1); }],
[0x7B, function() { VAR_CONV(0, 1); }],
[0x7C, function() { VAR_CONV(0, 2); }],
[0x7D, function() { VAR_CONV(1, 2); }],

[0x42, function() {
  // Get the Value
  var val = Stack.ppf64();
  wO('0x57 -> 0x42: INT(' + val + ')');
      
  if (val < 0) {
    Stack.pi32(Math.ceil(val));
  } else {
    Stack.pi32(Math.floor(val));
  }
}, 0x57]
);

function VAR_pADDR() {
  var LL = pdsf + u16(pB, pc + 1);
  wO('0x04 - 0x07: PUSH+ the address of LL+(' + LL + ')');
  Stack.pu16(LL);
  pc += 2;
}

function VAR_pEE_Val() {
  var EE = u16(pB, pc + 1);
  pc += 2;
      
  var EEt = getEEvt(EE);  
  var EEv = getEEv(EE);
      
  wO('0x08 - 0x0B: PUSH+ the value of EE+(' + EE + ') - [' + EEv + '] of type ' + EEt);
  Stack.pt(EEv, EEt);
}

function VAR_pEE_ADDR() {
  var EEn = i16(pB, pc + 1);
  wO('0x0C - 0x0F PUSH+ the address of EE+(' + EEn + ') - TODO');
  pc += 2;

  // Get the address of the global
  Stack.pu16(getEEa(EEn));
}

function VAR_Arr_ADDR(it) {
  // Get the array index
  var arg1 = Stack.ppi16();

  // Get the array address
  var LL = pdsf + u16(pB, pc + 1) + it * (arg1 - 1);
  wO('0x14-0x17: PUSH% the address(' + LL + ') of Array Index(' + arg1 + ')');
      
  Stack.pu16(LL);
  pc += 2;
}

function VAR_CONV(it, ot) {
  var a = Stack.pa([it]);
  wO('0x78 -0x7D: PUSH value of POP(' + a[0] + ') TYPE CONVERSION');
  Stack.pt(a[0], ot); 
}