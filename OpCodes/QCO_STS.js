opCodeFuncs.push(

[0x02, function() {
  var arg = pB[++pc];
  
  var args = [];
  for (var i = 0; i < arg - 1; i++) {
    args.push(Stack.pps());
  }
  args.push(Stack.ppi16());
  
  wO('0xFF -> 0x02: DIAMINIT - Todo');
}, 0xFF]

);