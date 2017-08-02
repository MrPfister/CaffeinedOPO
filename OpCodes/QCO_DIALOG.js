// Dialog Operators

opCodeFuncs.push(

[0xEC, function() { 
  var arg = pB[++pc];
  
  var dialogTitle = '';
  var dialogFlags = 0;
  
  if (arg == 0) {
    // dINIT
  } else if (arg == 1) {
    // dINIT title$
    dialogTitle = Stack.pps();
  } else {
    // dINIT title$, flags%
    dialogFlags = Stack.pi16();
    dialogTitle = Stack.pps();
  }
  
  wO('0xEC: dINIT "' + dialogTitle + '", ' + dialogFlags);
  DialogManager.dINIT(dialogTitle, dialogFlags);
}],

[0x37, function() {
  var arg = pB[++pc];
  wO('0x57 -> 0x37: DIALOG ');
  wO(' - Please follow the dialog instructions, otherwise press "Enter" to continue.');
  DialogManager.DIALOG();
}, 0x57],

[0x00, function() {
  var arg = pB[++pc];
  
  var dialogPrompt = '';
  var dialogText = '';
  var dialogStyle = 0;
  
  if (arg == 1) {
    dialogStyle = Stack.ppi16();
  }
  
  dialogText = Stack.pps();
  dialogPrompt = Stack.pps();
  
  wO('0xED -> 0x00: dTEXT "' + dialogPrompt + '", "' + dialogText + '", ' + dialogStyle);
  DialogManager.dTEXT(dialogPrompt, dialogText, dialogStyle);
}, 0xED],

[0x01, function() {
  var arg1 = Stack.pps();
  var arg2 = Stack.pps();
  var arg3 = Stack.ppu16();
  wO('0xED -> 0x01: dCHOICE ADDR(' + arg3 + '), "' + arg2 +'", "' + arg1 +'"');
  DialogManager.dCHOICE(arg3, arg2, arg1);
}, 0xED],

[0x02, function() {
  wO('0xED -> 0x02: dLONG - todo');
}, 0xED],

[0x03, function() {
  var arg1 = Stack.ppf64();
  var arg2 = Stack.ppf64();
  var arg3 = Stack.pps();
  var arg4 = Stack.ppu16();
  wO('0xED -> 0x03: dFLOAT ADDR(' + arg4 + '), "' + arg3 + '", min: ' + arg2 + ' max:' + arg1);
  DialogManager.dFLOAT(arg4, arg3, arg2, arg1);
}, 0xED],

[0x04, function() {
  wO('0xED -> 0x04: dTIME - todo');
}, 0xED],

[0x05, function() {
  wO('0xED -> 0x05: dDATE - todo');
}, 0xED],

[0x06, function() {
  var arg1 = Stack.pps();
  var arg2 = Stack.ppu16();
  wO('0xED -> 0x06: dEDIT ADDR(' + arg2 + '), "' + arg1 + '"');
  DialogManager.dEDIT(arg2, arg1, -1, false);
}, 0xED],

[0x07, function() {
  var arg1 = Stack.ppi16();
  var arg2 = Stack.pps();
  var arg3 = Stack.ppu16();
  wO('0xED -> 0x06: dEDIT ADDR(' + arg3 + '), "' + arg2 + '", ' + arg1);
  DialogManager.dEDIT(arg3, arg2, arg1, false);
}, 0xED],

[0x08, function() {
  var arg1 = Stack.pps();
  var arg2 = Stack.ppu16();
  wO('0xED -> 0x08: dXINPUT ADDR(' + arg2 + '), "' + arg1 + '"');
  DialogManager.dEDIT(arg2, arg1, -1, true);
}, 0xED],

[0x09, function() {
  wO('0xED -> 0x09: dFILE - todo');
}, 0xED],

[0x0A, function() {
  var arg = pB[++pc];
  wO('0xED -> 0x0A: dBUTTONS - todo');
}, 0xED],

[0x0B, function() {
  var arg1 = Stack.ppi16();
  var arg2 = Stack.ppi16();
  wO('0xED -> 0x0A: dPOSITION ' + arg2 + ', ' + arg1);
  DialogManager.dPOSITION(arg2, arg1);
}, 0xED]

);