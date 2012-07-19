// Variable stack
var vS = [];

// Stack Typecodes
// 0 - Int16
// 1 - Int32
// 2 - Double
// 3 - String
// 4 - UInt16

// Push 16bit signed int to the stack
function pi16(v) {
  vS.push([v,0]);
}

// Push 16bit unsigned int to the stack
function pu16(v) {
  vS.push([v,4]);
}

// Push 32bit signed int to the stack
function pi32(v) {
  vS.push([v,1]);
}

function ps(v) {
  vS.push([v,3]);
}

// Pop and discard
function ppd() {
  if (vS.length > 0 ) {
    vS.pop();
  }
}

// Pop to 16bit signed int
function ppi16() {
  if (vS.length == 0) {
    return 0;
  }
  
  return vS.pop()[0];
}

// Pop to 32bit signed int
function ppi32() {
  if (vS.length == 0) {
    return 0;
  }
  
  return vS.pop()[0];
}

// Pop to 16bit unsigned int
function ppu16() {
  return ppi16();
}

// Pop to string.
function pps() {
  return vS.pop()[0];
}

// Pop to byte array
function ppb() {
  // Work out the type
  var v = vS.pop();
  
  var t = v[1];
  
  // Convert the popped value to a byte array
  var rc = [];
  switch (t) {
    case 0:
      // Int16
    case 1:
      // Int32
    case 2:
      // Float
    case 3:
      // String
    case 4:
      // UInt16
  }
  
  return rc;
}

// Peek the data type of the top of the stack
function pkt() {
  if (vS.length > 0) {
    return vS[vS.length - 1][1];
  }
}

// Workaround for the @ PROC operator
function prcO(i) {
  return vS[vS.length - 1 - i][0];
}