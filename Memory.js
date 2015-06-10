// Memory Manager
var Mem = function(size) {
  // Alloc the memory
  this.m = new Array(size);
  
  // saves which cells memory belongs to
  // Layout: A/D, Size, Offset, Type
  this.c = [[0, size, 0, 0]];
  
  //Type
  // 0 = Unused
  // 1 = Global
  // 2 = Procedure
  // 3 = Dynamic
  
  // Peek at the contents of a memory address
  this.peek = function(i) {
    return this.m[i];
  };
  
  // Allocate in memory contents of a certain size
  this.alloc = function(s, t) {
    wO('Allocating ' + s + 'bytes of memory');
    for(var i = 0; i< this.c.length; i++) {
      var l = this.c[i][1], o = this.c[i][2];
      if (this.c[i][0] == 0 && l >= s) {
        wO(' * Cell found at ' +  o);
        // Cell is deallocated and has more or equal to the required length
        if (l == s) {
          // Equal sizes, reallocate cell
		  this.c[i] = [1, l, o, t];
          return o;
        } else {
          // Cell has more space than allocation, reallocate and create new
		  this.c[i] = [1, s, o, t];          
          // Create new cell
          this.c.push([0, l - s, o + s, 0]);
          return o;
        }
      }
    }
    // Allocation failed due to lack of space.
    return -1;
  };
  
  // Deallocate memory at a certain start point
  this.dealloc = function(s) {
    for (var i = 0; i < this.c.length; i++) {
      if (this.c[i][2] == s) {
      	wO(' * Deallocating memory segment ' + s + '->' + (s + this.c[i][1]));
        this.c[i][0] = 0;
        return 1;
      }
    }
    return -1;
  }
  
  // Reallocate the size of a memory structure
  this.realloc = function(s, n) {
    for (var i = 0; i < this.c.length; i++) {
      if (this.c[i][2] == s) {
        var l = this.c[i][1], o = this.c[i][2];
        if (n > l) {
          // New Allocation is larger
          var a = this.alloc(n);
          
          // Copy the data from the old location to the new
          this.m.splice(a,l,this.m.slice(s,l));
        } else if (n < l) {
          // New Allocation is smaller
          this.c[i][1] = n;
          
          // Create new empty cell
          this.c.push([0, l - n, o + s, 0]);
          return;
        }
      }
    }
  }
  
  // Reserve a specific space in memory - used only for globals
  // Does not expect the memory to already be allocated.
  this.reserve = function(o, s) {
    for (var i = 0; i< this.c.length; i++) {
	  var co = this.c[i][2];
      if (o == co) {
        // The offset of the allocated chunk starts at the same offset as
        // the free piece of memory
        if (s > this.c[i][1] || this.c[i][0] == 1) {
          wO('Reserved memory location ' + o + ' has already been allocated: ' + this.c[i][0] + ', ' + this.c[i][1]);
          return;
        }
        
        // Allocate cell
    	wO('Reserving ' + s + ' bytes of memory at ' + o);
    	
    	if (s != this.c[i][1]) {
    		// Need to split the end of the cell
          	this.c.push([0, this.c[i][1] - s, o + s, 0]);
    	}
    	// Allocate it as used
		this.c[i] = [1, s, o, 1];
        
      } else if (o > co && o < co + this.c[i][1]) {
        // The offset of the allocated chunk starts further along the free
        // piece of memories chunk. Need to free the first part
        wO(' * Cell found: ' + this.c[i][0] + ', ' + this.c[i][1] + ', ' + co);
        
        if (o + s > co + this.c[i][1] || this.c[i][0] == 1) {
          wO('Reserved memory location ' + o + ' has already been allocated');
          return;
        }
        
    	wO('Creating new cell at ' + co + ' of length ' + (o - co) + ' to reserve memory');
        
        // Create new empty cell at the beginning of the cell
        this.c.push([0, o - co , co, 0]);
        
        // Readjust the current cell
        this.c[i][1] = this.c[i][1] - (o - co);
        this.c[i][2] = o;
        
        wO(' * Cell modified to: [' + this.c[i][0] + ', ' + this.c[i][1] + ', ' + o + ']');
        
        
        // Call this function again, will create from an empty cell with the start
        // offset
        this.reserve(o, s);
      }
    }
  }
  
  // Copy a memory sequence into memory
  this.set = function(o, v) {
    if (o < 0 || o >= this.m.length) {
      // Array offset out of bounds
      wO('Memory set operation failure, memory out of range ' + o + ' vs ' + this.m.length);
    } else {
      // Splice did not correctly work
      for (var i = 0; i< v.length; i++) {
        this.m[o + i] = v[i];
      }
    }
  }
}

// Return a 16 bit Signed Integer
// a = Array
// o = Offset
function i16(a,o) {
    return iC(a,o,2);
}

// Return a 64 bit Float
// a = Array
// o = Offset
function f64(a,o) {
	var buffer = new ArrayBuffer(8);
	var uint8s = new Uint8Array(buffer);
	uint8s[0] = a[o];
	uint8s[1] = a[o + 1];
	uint8s[2] = a[o + 2];
	uint8s[3] = a[o + 3];
	uint8s[4] = a[o + 4];
	uint8s[5] = a[o + 5];
	uint8s[6] = a[o + 6];
	uint8s[7] = a[o + 7];
	var fBuffer = new Float64Array(buffer);
	
    return fBuffer[0];
}

// Return a 32 bit Signed Integer
// a = Array
// o = Offset
function i32(a,o) {
    return iC(a,o,4);
}

// Return a 16 bit Unsigned Integer
// a = Array
// o = Offset
function u16(a,o) {
    return i16(a,o);
}

// Return a 32 bit Unsigned Integer
// a = Array
// o = Offset
function u32(a,o) {
    return i32(a,0);
}

// Integer Bitwise converter
function iC(a,o,l) {
    var r = 0;
    for (var i=0; i<l; i++) {
      r += a[i + o] << (i * 8);
    }
    return r;
}

function cf64(v) {
  var buffer = new ArrayBuffer(8);
  var intView = new Uint8Array(buffer);
  var floatView = new Float64Array(buffer);
  
  floatView[0] = v;
  
  return intView;
}


// Convert a hex string into an array of bytes
function Hex2Bytes(s) {
  r=[];
  for (var i=0; i<s.length; i++) {
    r.push(parseInt(s[i] + s[++i], 16));
  }
  return r;
}