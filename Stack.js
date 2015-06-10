var Stack = {

	// Variable stack
	vS: []

	// Stack Typecodes
	// 0 - Int16
	// 1 - Int32
	// 2 - 64bit Float
	// 3 - String
	// 4 - UInt16
};
	
// Push 16bit signed int to the stack
Stack.pi16 = function(v) {
	sp = new Int16Array(1);
	sp[0] = v;
	this.vS.push([sp,0]);
};

// Push 32bit signed int to the stack
Stack.pi32 = function(v) {
	sp = new Int32Array(1);
	sp[0] = v;
  this.vS.push([sp,1]);
};

// Push a 64bit float to the stack
Stack.pf64 = function(v) {
	sp = new Float64Array(1);
	sp[0] = v;
  this.vS.push([sp,2]);
};

// Push a string to the stack
Stack.ps = function(v) {
  this.vS.push([v,3]);
};

// Push 16bit unsigned int to the stack
Stack.pu16 = function(v) {
	sp = new Uint16Array(1);
	sp[0] = v;
	this.vS.push([sp,4]);
};

// Pop and discard
Stack.ppd = function() {
  if (this.vS.length > 0 ) {
	this.vS.pop();
  }
};

Stack.ppn = function(){
  if (this.vS.length == 0) {
	return 0;
  }
  
  return this.vS.pop()[0][0];
};

// Pop to 16bit signed int
Stack.ppi16 = function() {
  return this.ppn();
};

// Pop to 32bit signed int
Stack.ppi32 = function(){
  return this.ppn();
};

// Pop to 16bit unsigned int
Stack.ppu16 = function() {
  return this.ppn();
};

// Pop to 64bit float
Stack.ppf64 = function() {
  return this.ppn();
};

// Pop to string.
Stack.pps = function() {
  return this.vS.pop()[0];
};

// Pop to byte array
Stack.ppb = function() {
  // Work out the type
  var v = this.vS.pop();
  
  var t = v[1];
  
  // Convert the popped value to a byte array
  var rc = [];
  switch (t) {
    case 0:
	case 1:
	case 2:
	case 4:
	  // Int16, Int32, Float, UInt16
	  var uBuffer = new Uint8Array( v[0].buffer );
	  for (var uLen = 0; uLen < uBuffer.length; uLen++) {
		rc.push(uBuffer[uLen]);
	  }
	  break;
	case 3:
	  // String
	  return Str2CStr(v[0]);
	  break;
  }
  
  return rc;
};

// Pop an array of arguments
Stack.pa = function(t) {
  var v = [];
  for (var i = 0; i < t.length; i++) {
    switch (t[i]) {
	case 0:
	  v.push(Stack.ppi16());
	  break;
	case 1:
	  v.push(Stack.ppi32());
	  break;
	case 2:
	  v.push(Stack.ppf64());
	  break;
	case 3:
	  v.push(Stack.pps());
	  break;
	case 4:
	  v.push(Stack.ppu16());
	  break;
    }
  }
  return v;
}

// Push a variable to the stack
Stack.pt = function(v, t) {
  switch (t) {
    case 0:
	  Stack.pi16(v);
	  break;
	case 1:
	  Stack.pi32(v);
	  break;
	case 2:
	  Stack.pf64(v);
	  break;
	case 3:
	  Stack.ps(v);
	  break;
	case 4:
	  Stack.pu16(v);
	  break;
  }
};

// Peek the data type of the top of the stack
Stack.pkt = function() {
  if (this.vS.length > 0) {
	return this.vS[this.vS.length - 1][1];
  }
};

// Workaround for the @ PROC operator
Stack.prcO = function(i) {
  return this.vS[this.vS.length - 1 - i][0];
};