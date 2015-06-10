// Procedure List
var pList = [];

// Executable File
var exe = function(b) {
  this.d = b;
  
  wO('Load the file: [' + QStr(b, 0, 15) + ']');
  if (!strcmp(QStr(b, 0, 15), "OPLObjectFile**")) {
    wO('Not a valid executable');
    return;
  }
  
  // Offset 16 (W) : OPO version (Ignored)
  
  // Source File Name
  this.sn = CStr(b,20);
  wO('Source file: ' + this.sn);
  
  // Offset 18 (W) : Offset to second header
  var sH = i16(b,18);
  wO('Offset to second header: ' + sH);
  
  // Offset 0 (L) : Executable File length (Ignored)
  
  // Executable Type
  this.t = i16(b, sH + 4); // Offset 4 (W) : 4367->S3 4383->Sa (Ignored)
  wO('Executable Type: ' + this.t);
  
  // Offset 6 (W) : Required Runtime (Ignored)
  // Offset 8 (L) : Offset to Procedure Table
  var pT = i32(b, sH + 8);
  wO('Procedure Table Offset: ' + pT);
  
  while (b[pT] != 0 || b[pT + 1] != 0) {
    var p = new Object();
    
    // Add procedure information
    wO('New Procedure Found: ' + pT);
    
    // Parent exe
    p.e = this;
    
    // Proc Name
    p.n = CStr(b, pT);
    wO(' - Name: [' + p.n + ']');
    
    pT+=b[pT] + 1;
    
    // File Offset
    p.f = i32(b, pT);
    var fO = p.f;
    wO(' - Offset: ' + p.f);
    
	// Source location is ignored.
	
    pT+= 6;
    
    // Retrieve the information about the Procedure
    if (this.t >= 4383) {
      // Translater version $111F and above only
      fO += 2;
    }
    
    // DSF Size
    p.d = i16(b, fO);
    wO(' - DSF Size: [' + p.d + ']');
    
    // QCode Size
    p.q = i16(b, fO + 2);
    wO(' - QCode Size: [' + p.q + ']');
    
    fO += 6;
    
    // Parameter Section
    p.ps = b[fO];
    wO(' - Parameter Size: [' + p.ps + ']');
    
    p.p = [];
    for (var i=0; i< p.ps; i++) {
      p.p.push(++fO);
    }
    fO++;
    
    // Global Declarations
    p.gs = i16(b, fO);
    p.gvs = [];
    wO(' - Global Declaration Size: [' + p.gs + ']');
    
    fO+=2;
    
    // If it was 0, then no globals were declared in this procedure
    if (p.gs != 0) {
    	// Store the end point
    	var ge = fO + p.gs;
    	do {
    	  // Make a global variable entry for the procedure
    	  var gv = new Object();
    	  wO('New Global Declaration');
    	  
    	  // Parent procedure
    	  gv.p = this;
    	  
    	  // Name
    	  gv.n = CStr(b, fO);
    	  wO(' - Global Name: [' + gv.n +']');
    	  
    	  // TypeCode
    	  fO+=1 + b[fO];
    	  gv.t = a = b[fO];
    	  
    	  // Work out the number of bytes required by the global
    	  // If it is an array it is calculated later
    	  if (a == 0) { gv.l = 2; } 
          else if (a == 1) { gv.l = 4; } 
          else if (a == 2) { gv.l = 8; } 
          else {gv.l = 0; }
    	  
    	  // DSF offset
    	  gv.d = i16(b, ++fO);
    	  p.gvs.push(gv);
    	  fO += 2;
    	  
    	  // Reserve the space in the DSF for the Global variable if it is not an array
    	  if (gv.l > 0) {
			DSF.reserve(gv.d, gv.l);
    	  }
    	  
    	} while (fO < ge);
    }
    
    // Called Procedure Section
    // Size of the Called procedure section
    p.cps = i16(b, fO);
    wO(' - Called Procedures: [' + p.cps + ']');
    
    fO+=2;
    
    // Called Procedure Start Offset
    p.cp = [];
    var cpT = fO;
    if (p.cps != 0) {
		// Process procedures that are called
		
		// Store the sections end offet
		var cpeo = fO + p.cps;
		do {
		  var cpe = new Object();
    	  wO('New Called Procedure');
		  
		  // Name
		  cpe.n = CStr(b, fO);
    	  wO(' - Global Name: [' + cpe.n +']');
		  
		  // Arguments
		  cpe.a = b[fO + 1 + b[fO]];
    	  wO(' - Arguments: ' + cpe.a);
		  		  
		  // Add the called procedure references to the procedure body
		  p.cp.push(cpe);
		  
		  fO += 2 + b[fO];
		} while (fO < cpeo);
    }
    
    // Global References Section
    p.gr = [];
    
    // Store the Global Reference Offset
    wO('Global References');
    
    // The global references section ends in a 0 byte
    while (b[fO] != 0) {
      // Global Reference called Entry
      var grce = new Object();
      wO('New Global Reference');
      
      // Name
      grce.n = CStr(b, fO);
      wO(' - Name: [' + grce.n +']');
      
      // Typecode
      grce.t = b[fO + 1 + b[fO]];
      wO(' - Typecode: ' + grce.t);
      
      // Add the global reference to the procedure body
      p.gr.push(grce);
      
      fO += 2 + b[fO];
    }
    fO++;
    
    
    // String Control Section
    p.sc = [];
    
    wO('String Control section');
    
    while (b[fO] != 0 || b[fO + 1] != 0) {
    	var se = new Object();
    	wO('New String');
    	
    	// Data Stack Offset
    	se.dso = i16(b, fO);
      	wO(' - Offset: ' + se.dso);
    	
    	// Size
    	se.s = b[fO + 2];
      	wO(' - Size: ' + se.s);
    	
    	// Add to the procedure body
    	p.sc.push(se);
    	
    	fO += 3;
    }
    fO+=2;
    
    // Array Control Section
    p.ac = [];
    wO('Array Control section');
    
    while (b[fO] != 0 || b[fO + 1] != 0) {
    	var ar = new Object();
    	
    	wO('New Array');
		
    	// Data Stack Offset
    	ar.dso = i16(b, fO);
      	wO(' - Offset: ' + ar.dso);
    	
    	// Size
    	ar.s = i16(b, fO + 2);
      	wO(' - Size: ' + ar.s);
    	
    	// Add to the procedure body
    	p.ac.push(ar);
    	
    	fO += 4;
    }
    fO+=2;
    
    // Save the Q-Code
    p.qc = b.slice(fO, fO + p.q);
    
    // Calculate EE offsets for the PROC
    
    // EE offsets always start at 18
    var EEo = 18;
    
    // Order:
    // * Global Variables defined in the Proc
    // * Procedures Called
    // * Parameters of the Procedure
    // * Global Variables Referenced
            
    // Global Variables defined in the procedure.   
    for (var i = 0; i < p.gvs.length; i++) {
      p.gvs[i].EEi = EEo;
      EEo += p.gvs[i].n.length + 4;
    }
    
    // Called Procedures
    for (var i = 0; i < p.cp.length; i++) {
      p.cp[i].EEi = EEo;
      EEo += p.cp[i].n.length + 2;
    }
    
    // Parameters
    for (var i = 0; i < p.p.length; i++) {
      p.p[i].EEi = EEo;
      EEo += 2;
    }
    
    // Global Variables Referenced
    for (var i = 0; i < p.gr.length; i++) {
      p.gr[i].EEi = EEo;
      EEo += 2;
    }
    
    // Add the procedure to the list
    pList.push(p);
  };
  wO('Executable Loaded');
}