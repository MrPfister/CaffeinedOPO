// The stack uses the Heap for memory allocation to support direct interaction with proc parameters.

var Stack = {

	// Variable stack
	vS: []

	// Stack Typecodes
	// 0 - Int16
	// 1 - Int32
	// 2 - 64bit Float
	// 3 - String
	// 4 - UInt16
	
	//Stack Layout:
	// [DSF Location, Type]
};
	
// Push 16bit signed int to the stack
Stack.pi16 = function(v) {
  var dsfLoc = DSF.alloc(2, 4);
  DSF.set(dsfLoc, i162b(v));
  this.vS.push([dsfLoc, 0]);
};

// Push 32bit signed int to the stack
Stack.pi32 = function(v) {
  var dsfLoc = DSF.alloc(4, 4);
  DSF.set(dsfLoc, i322b(v));
  this.vS.push([dsfLoc, 1]);
};

// Push a 64bit float to the stack
Stack.pf64 = function(v) {
  sp = new Float64Array(1);
  sp[0] = v;
  
  var dsfLoc = DSF.alloc(8, 4);
  DSF.set(dsfLoc, sp.buffer)
  this.vS.push([dsfLoc, 2]);
};

// Push a string to the stack
Stack.ps = function(v) {
  var strBuf = Str2CStr(v);
  var dsfLoc = DSF.alloc(strBuf.length, 4);
  DSF.set(dsfLoc, strBuf);
  this.vS.push([dsfLoc, 3]);
};

// Push 16bit unsigned int to the stack
Stack.pu16 = function(v) {
  if (v < 0)
	  v = -v;
  
  var dsfLoc = DSF.alloc(2, 4);
  DSF.set(dsfLoc, i162b(v));
  this.vS.push([dsfLoc, 4]);
};

// Pop and discard
Stack.ppd = function() {
  if (this.vS.length > 0 ) {
	var obj = this.vS.pop();
	
	DSF.dealloc(obj[0]);
  }
};

Stack.ppn = function(){
  if (this.vS.length == 0) {
	return 0;
  }
  
  var obj = this.vS.pop();
  var n = 0;
  if (obj[1] == 0 || obj[1] == 4)
  {
    n = i16(DSF.m, obj[0]);
  }
  else if (obj[1] == 1)
  {
    n = i32(DSF.m, obj[0]);
  }
  else if (obj[1] == 2)
  {
    var n = f64(DSF.m, obj[0]);
  }
  
  DSF.dealloc(obj[0]);
  return n;
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
  var obj = this.vS.pop();
  
  var s = CStr(DSF.m, obj[0]);
  DSF.dealloc(obj[0]);  
  return s;
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
	case 4:
	  rc = DSF.m.slice(v[0], v[0] + 2);
	  break;
	case 1:
	  rc = DSF.m.slice(v[0], v[0] + 4);
	  break;
	case 3:
	  rc = DSF.m.slice(v[0], v[0] + 8);
	  break;
	case 3:
	  // String
	  rc = DSF.m.slice(v[0], v[0] + DSF.m[v[0]] + 1);
	  break;
  }
  
  DSF.dealloc(v[0]);
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
	  Stack.pi16(Math.round(v));
	  break;
	case 1:
	  Stack.pi32(Math.round(v));
	  break;
	case 2:
	  Stack.pf64(v);
	  break;
	case 3:
	  Stack.ps(v);
	  break;
	case 4:
	  Stack.pu16(Math.round(v));
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

Stack.visualise = function() {
	return;
  if (stackWin != null) {
    var debugTxt = '';
    for(var i=0; i< this.vS.length; i++) {
      debugTxt += this.vS[i] + '<br />';
    }
    stackWin.innerHTML = debugTxt;
  }
}