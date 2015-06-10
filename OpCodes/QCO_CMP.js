// Binary Comparison functions

opCodeFuncs.push(

[0x30, function() {CMP_LT(0); }],
[0x31, function() {CMP_LT(1); }],
[0x32, function() {CMP_LT(2); }],
[0x33, function() {
  var arg1 = Stack.ppb();
  var arg2 = Stack.ppb();
  wO('0x33: PUSH (i16) ' + arg2[0] + ' < ' + arg1[0]);
  Stack.pi16(-(arg2[0] < arg1[0]));
}],

[0x34, function() {CMP_LET(0); }],
[0x35, function() {CMP_LET(1); }],
[0x36, function() {CMP_LET(2); }],
[0x37, function() {
  var arg1 = Stack.ppb();
  var arg2 = Stack.ppb();
  wO('0x37: PUSH (i16) ' + arg2[0] + ' <= ' + arg1[0]);
  Stack.pi16(-(arg2[0] <= arg1[0]));
}],

[0x38, function() {CMP_MT(0); }],
[0x39, function() {CMP_MT(1); }],
[0x3A, function() {CMP_MT(2); }],
[0x3B, function() {
  var arg1 = Stack.ppb();
  var arg2 = Stack.ppb();
  wO('0x3B: PUSH (i16) ' + arg2[0] + ' > ' + arg1[0]);
  Stack.pi16(-(arg2[0] > arg1[0]));
}],

[0x3C, function() {CMP_MET(0); }],
[0x3D, function() {CMP_MET(1); }],
[0x3E, function() {CMP_MET(2); }],
[0x3F, function() {
  var arg1 = Stack.ppb();
  var arg2 = Stack.ppb();
  wO('0x3F: PUSH (i16) ' + arg2[0] + ' >= ' + arg1[0]);
  Stack.pi16(-(arg2[0] >= arg1[0]));
}],

[0x40, function() {CMP_EQ(0); }],
[0x41, function() {CMP_EQ(1); }],
[0x42, function() {CMP_EQ(2); }],
[0x43, function() {
  var arg1 = Stack.pps();
  var arg2 = Stack.pps();
  wO('0x43: PUSH (i16) ' + arg2 + ' = ' + arg1);
  if (strcmp(arg1,arg2) == 1) {
    Stack.pi16(-1);
  } else {
    Stack.pi16(0);
  }
}],

[0x44, function() {CMP_NEQ(0); }],
[0x45, function() {CMP_NEQ(1); }],
[0x46, function() {CMP_NEQ(2); }],
[0x47, function() {
  var arg1 = Stack.pps();
  var arg2 = Stack.pps();
  wO('0x47: PUSH (i16) ' + arg2 + ' <> ' + arg1);
  if (strcmp(arg1,arg2) != 1) {
    Stack.pi16(-1);
  } else {
    Stack.pi16(0);
  }
}]

);

// Less than
function CMP_LT(v) {
  var a = Stack.pa([v,v]);
  wO('0x' + (30 + v) + ': PUSH (i16) ' + a[1] + ' < ' + a[0]);
  Stack.pi16(-(a[0] > a[1]));
}

// Less Equal than
function CMP_LET(v) {
  var a = Stack.pa([v,v]);
  wO('0x' + (34 + v) + ': PUSH (i16) ' + a[1] + ' <= ' + a[0]);
  Stack.pi16(-(a[0] >= a[1]));
}

// More than
function CMP_MT(v) {
  var a = Stack.pa([v,v]);
  wO('0x' + (38 + v) + ': PUSH (i16) ' + a[1] + ' > ' + a[0]);
  Stack.pi16(-(a[0] < a[1]));
}

// More Equal than
function CMP_MET(v) {
  var a = Stack.pa([v,v]);
  wO('0x' + (0x3C + v).toString(16) + ': PUSH (i16) ' + a[1] + ' >= ' + a[0]);
  Stack.pi16(-(a[1] >= a[0]));
}

// Equals
function CMP_EQ(v) {
  var a = Stack.pa([v,v]);
  wO('0x' + (40 + v) + ': PUSH (i16) ' + a[1] + ' = ' + a[0]);
  Stack.pi16(-(a[1] == a[0]));
}

// Not Equals
function CMP_NEQ(v) {
  var a = Stack.pa([v,v]);
  wO('0x' + (44 + v) + ': PUSH (i16) ' + a[1] + ' <> ' + a[0]);
  Stack.pi16(-(a[1] != a[0]));
}