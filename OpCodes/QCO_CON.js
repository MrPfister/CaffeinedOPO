// Graphical Console Input/Output

opCodeFuncs.push(

// 0x88-0x8B PRINT pop+ ;
[0x88, function() {
  var arg = Stack.ppi16();
  wO('0x88: PRINT ' + arg + '; - Todo');
}],
[0x89, function() {
  var arg = Stack.ppi32();
  wO('0x89: PRINT ' + arg + '; - Todo');
}],
[0x8A, function() {
  var arg = Stack.ppf64();
  wO('0x8a: PRINT ' + arg + '; - Todo');
}],
[0x8B, function() {
  var arg = Stack.pps();
  wO('0x8b: PRINT ' + arg + '; - Todo');
}],
[0x90, function() {
  wO('0x8b: PRINT , - Todo');
}],
[0x92, function() {
  wO('0x8b: PRINT  - Todo');
}],

[0xA2, function() {
  wO('0xA2: CLS - Todo');
}],

[0x05, function() {
  wO('0xFF -> 0x05: STYLE - Todo');
}, 0xFF]

);