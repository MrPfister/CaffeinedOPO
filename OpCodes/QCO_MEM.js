// Memory Functions

opCodeFuncs.push(

[0x84, function() { MEM_STR(0); }],
[0x85, function() { MEM_STR(1); }],
[0x86, function() { MEM_STR(2); }],
[0x87, function() { MEM_STR(3); }],

// 0x57 Functions
[0x00, function() { 
  var arg = Stack.ppu16();
  wO('0x57 0x00: ADDR ' + arg);
  Stack.pi16(arg);
}, 0x57]
);

function MEM_STR(cI) {
  // Value
  var v = Stack.ppb();  
  
  // Address
  var addr = Stack.ppu16();
      
  wO('0x8' + (4 + cI) + ': Store bytes [' + v + '] in location ' + addr + ' -> ' + (addr + v.length - 1) );
  DSF.set(addr, v);
}