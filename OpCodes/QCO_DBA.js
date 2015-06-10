opCodeFuncs.push(

[0x20, function() {
  // Extract the DB Indexer
  var arg = pB[++pc];

  wO('0x20: push+ the value of field pop$+ of data file ' + arg + ' - Todo');
}],
[0x21, function() {
  // Extract the DB Indexer
  var arg = pB[++pc];

  wO('0x21: push+ the value of field pop$+ of data file ' + arg + ' - Todo');
}],
[0x22, function() {
  // Extract the DB Indexer
  var arg = pB[++pc];

  wO('0x22: push+ the value of field pop$+ of data file ' + arg + ' - Todo');
}],
[0x23, function() {
  // Extract the DB Indexer
  var arg = pB[++pc];

  wO('0x23: push+ the value of field pop$+ of data file ' + arg + ' - Todo');
}],

[0x25, function() {
  // Extract the DB Indexer
  var arg = pB[++pc];

  wO('0x25: push= the address of field pop$+ of data file ' + arg + ' - Todo');
}],

[0xA1, function() {
  wO('0xA1: CLOSE - Todo');
}],

[0xB4, function() {
  // Extract the DB Indexer
  var arg = pB[++pc];
  
  var dbArgs = [];
  
  // Iterate through working out variable names till 0xFF is hit
  var param = pB[++pc];
  while(param != 0xFF) {
    // Get the variable name length
    var pLen = pB[++pc];
	
	// Read the variable name
	var pName = CStr(pB,pc);
	dbArgs.push([param, pName]);
	
	pc += pLen;
	param = pB[++pc];
  }
  
  wO('0xB4: OPEN - Todo');
  // OPEN(arg, dbArgs);
}]

);