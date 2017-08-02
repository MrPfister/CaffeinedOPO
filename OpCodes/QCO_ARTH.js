// Arithmetic Operators

opCodeFuncs.push(

[0x48, function() { ARTH_ADD(0); }],
[0x49, function() { ARTH_ADD(1); }],
[0x4A, function() { ARTH_ADD(2); }],
[0x4B, function() { ARTH_ADD(3); }],

[0x4C, function() { ARTH_SUB(0); }],
[0x4D, function() { ARTH_SUB(1); }],
[0x4E, function() { ARTH_SUB(2); }],

[0x50, function() { ARTH_MUL(0); }],
[0x51, function() { ARTH_MUL(1); }],
[0x52, function() { ARTH_MUL(2); }],

[0x54, function() { ARTH_DIV(0); }],
[0x55, function() { ARTH_DIV(1); }],
[0x56, function() { ARTH_DIV(2); }],

[0x58, function() { ARTH_POW(0); }],
[0x59, function() { ARTH_POW(1); }],
[0x5A, function() { ARTH_POW(2); }],

[0x5C, function() { ARTH_AND(0); }],
[0x5D, function() { ARTH_AND(1); }],
[0x5E, function() { ARTH_AND(2); }],

[0x60, function() { ARTH_OR(0); }],
[0x61, function() { ARTH_OR(1); }],
[0x62, function() { ARTH_OR(2); }],

[0x64, function() { ARTH_NOT(0); }],
[0x65, function() { ARTH_NOT(1); }],
[0x66, function() { ARTH_NOT(2); }],

[0x68, function() { ARTH_MINUS(0); }],
[0x69, function() { ARTH_MINUS(1); }],
[0x6A, function() { ARTH_MINUS(2); }],

[0xB9, function() { 
  Stack.ppd();
  wO('0xB9: RANDOMIZE');
}],

[0x90, function() { 
  var arg = Stack.ppf64();
  wO('0x57 -> 0x90: SQR(' + arg +')');
  Stack.pf64(Math.sqrt(arg));
}, 0x57]

);

// Addition
function ARTH_ADD(v) {
  var a = Stack.pa([v,v]);
  wO('0x' + (0x48 + v).toString(16) + ': PUSH (+) ' + a[1] + ' + ' + a[0] + ' = ' + (a[1] + a[0]));
  Stack.pt(a[1] + a[0], v); 
}

// Subtraction
function ARTH_SUB(v) {
  var a = Stack.pa([v,v]);
  wO('0x' + (0x4C + v).toString(16) + ': PUSH (+) ' + a[1] + ' - ' + a[0]);
  Stack.pt(a[1] - a[0], v); 
}

// Multiplication
function ARTH_MUL(v) {
  var a = Stack.pa([v,v]);
  wO('0x' + (50 + v) + ': PUSH (+) ' + a[1] + ' * ' + a[0]);
  Stack.pt(a[1] * a[0], v); 
}

// Division
function ARTH_DIV(v) {
  var a = Stack.pa([v,v]);
  wO('0x' + (54 + v) + ': PUSH (+) ' + a[1] + ' / ' + a[0]);
  Stack.pt(a[1] / a[0], v); 
}

// Power Of
function ARTH_POW(v) {
  var a = Stack.pa([v,v]);
  var rc = Math.pow(a[1], a[0]);
  wO('0x' + (0x58 + v).toString(16) + ': push% POP+2(' + a[1] + ') ^ POP+1(' + a[0] +')');
  Stack.pt(rc, v); 
}

// Minus POP+
function ARTH_MINUS(v) {
  wO('0x' + (0x68 + v).toString(16) + ': PUSH% -POP+');
  Stack.pt(-Stack.pa([v])[0], v);
}

// NOT binary operator
function ARTH_NOT(v) {
  var a = Stack.pa([v]);
  wO('0x' + (64 + v) + ': push% NOT pop%(' + a[0] + ')');
  Stack.pt(~a[0], v); 
}

// AND binary operator
function ARTH_AND(v) {
  var a = Stack.pa([v]);
  var b = Stack.pa([v]);
  wO('0x5C - 0x5E: push% pop2% AND pop1%');
  Stack.pt(a & b, v); 
}

// OR binary operator
function ARTH_OR(v) {
  var a = Stack.pa([v]);
  var b = Stack.pa([v]);
  wO('0x60 - 0x62: push% pop2% OR pop1%');
  Stack.pt(a | b, v); 
}