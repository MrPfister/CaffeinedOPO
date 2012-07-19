// Memory Manager
var Mem = function(size) {
  // Alloc the memory
  this.m = new Array(size);
  
  // saves which cells memory belongs to
  // Layout: A/D, Size, Offset
  this.c = [[0,size,0]];
  
  // Peek at the contents of a memory address
  this.peek = function(i) {
    return this.m[i];
  };
  
  // Allocate in memory contents of a certain size
  this.alloc = function(s) {
    wO('Allocating ' + s + 'bytes of memory');
    for(var i = 0; i< this.c.length; i++) {
      var l = this.c[i][1], o = this.c[i][2];
      if (this.c[i][0] == 0 && l >= s) {
        wO(' * Cell found at ' +  this.c[i][2]);
        // Cell is deallocated and has more or equal to the required length
        if (l == s) {
          // Equal sizes, reallocate cell
          this.c[i][0] = 1;
          return o;
        } else {
          // Cell has more space than allocation, reallocate and create new
          this.c[i][0] = 1;
          this.c[i][1] = s;
          
          // Create new cell
          this.c.push([0, l - s, o + s]);
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
          this.c.push([0, l - n, o + s]);
          return;
        }
      }
    }
  }
  
  // Reserve a specific space in memory - used for globals
  this.reserve = function(o, s) {
    for (var i = 0; i< this.c.length; i++) {
      if (i >= this.c[i][2] && i <= this.c[i][2] + this.c[i][1]) {
      	// Allocate the space
      	// TODO
      }
    }
  }
  
  // Copy a memory sequence into memory
  this.set = function(o, v) {
    if (o < 0 || o >= this.m.length) {
      // Array offset out of bounds
      wO('Memory set operation failure, memory out of range ' + o + ' vs ' + this.m.length);
    } else {
      this.m.splice(o,v.length, v);
    }
  }
}

// Return a 16 bit Signed Integer
// a = Array
// o = Offset
function i16(a,o) {
    return iC(a,o,2);
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


// Convert a hex string into an array of bytes
function Hex2Bytes(s) {
  r=[];
  for (var i=0; i<s.length; i++) {
    r.push(parseInt(s[i] + s[++i], 16));
  }
  return r;
}