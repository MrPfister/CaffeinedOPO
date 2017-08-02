// Menu Operators

opCodeFuncs.push(

[0xEA, function() {
  wO('0xEA: mINIT');
}],

[0xEB, function() {
  var arg = pB[++pc];
  wO('0xEB: mCARD ' + arg + ' - TODO');
  
  for (var i=0; i< arg*2+1; i++)
  {
	  Stack.ppd();
  }
}],

[0x36, function() {
  wO('0x57 -> 0x36: MENU - TODO');
  
  Stack.pi16(0); // Simulate pressing escape
}, 0x57]

);