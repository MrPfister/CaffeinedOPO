// File Operators (0x57 Funcs)

opCodeFuncs.push(

[0xF8, function() { 
  var arg1 = Stack.pps();
  wO('0xF8: MKDIR ' + arg1 + ' - TODO');
}],

[0x08, function() { 
  wO('0x57 0x08: EXIST');
  Stack.pi16(0); // -1 would be true
}, 0x57]

);