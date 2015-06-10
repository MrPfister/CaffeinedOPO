function w_CALL(n) {
  var cStack = [];
  
  for (var i=0; i<n; i++) {
    cStack.push(Stack.ppi16());
  }
  
  wO('Unknown CALL: ' + cStack);
}