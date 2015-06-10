// Time Operators (0x57 Funcs)

opCodeFuncs.push(

[0x04, function() { 
  wO('0x57 0x04: DAY');
  var d = new Date();
  Stack.pi16(d.getDate()); 
}, 0x57],

[0x12, function() { 
  wO('0x57 0x12: HOUR');
  var d = new Date();
  Stack.pi16(d.getHours()); 
}, 0x57],

[0x16, function() { 
  wO('0x57 0x16: MINUTE');
  var d = new Date();
  Stack.pi16(d.getMinutes()); 
}, 0x57],

[0x17, function() { 
  wO('0x57 0x17: MONTH');
  var d = new Date();
  Stack.pi16(d.getMonth()); 
}, 0x57],

[0x1C, function() { 
  wO('0x57 0x1C: SECOND');
  var d = new Date();
  Stack.pi16(d.getSeconds()); 
}, 0x57]

);