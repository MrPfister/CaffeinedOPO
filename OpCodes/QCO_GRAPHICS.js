// Graphics Operators

opCodeFuncs.push(

[0xC6, function() {
  var arg = Stack.ppi16();
  wO('0xC6: gCLOSE ' + arg);
  Renderer.gCLOSE(arg);
}],

[0xC7, function() {
  var arg = Stack.ppi16();
  wO('0xC7: gUSE ' + arg);
  Renderer.gUSE(arg);
}],

[0xC9, function() {
  var arg = pB[++pc];
  wO('0xC9: gVISIBLE ' + arg);
  Renderer.gVISIBLE(arg);
}],

[0xCA, function() {
  var arg = Stack.ppi16();
  wO('0xCA: gFONT ' + arg);
  Renderer.gFONT(arg);
}],

[0xCE, function() {
  var arg = Stack.ppi16();
  wO('0xCE: gSTYLE ' + arg);
  Renderer.gSTYLE(arg);
}],

[0xCF, function() {
  var arg1 = Stack.ppi16();
  var arg2 = Stack.ppi16();
  wO('0xCF: gORDER ' + arg2 + ', ' + arg1);
  Renderer.gORDER(arg2, arg1);
}],

[0xD1, function() {
  wO('0xD1: gCLS');
  Renderer.gCLS();
}],

[0xD2, function() {
  var y = Stack.ppi16();
  var x = Stack.ppi16();
  wO('0xD2: gAT(' + x + ', ' + y + ')');
  Renderer.gAT(x,y);
}],

[0xD3, function() {
  var y = Stack.ppi16();
  var x = Stack.ppi16();
  wO('0xD3: gMOVE(' + x + ', ' + y + ')');
  Renderer.gMOVE(x,y);
}],

[0xD4, function() {
  var arg = Stack.ppi16();
  wO('0xD4: gPRINT ' + arg);
  Renderer.gPRINT(arg1);
}],

[0xD5, function() {
  var arg1 = Stack.ppi32();
  wO('0xD5: gPRINT ' + arg1);
  Renderer.gPRINT(arg1);
}],

[0xD6, function() {
  var arg1 = Stack.ppf64();
  wO('0xD6: gPRINT ' + arg1);
  Renderer.gPRINT(arg1);
}],

[0xD7, function() {
  var arg1 = Stack.pps();
  wO('0xD7: gPRINT ' + arg1);
  Renderer.gPRINT(arg1);
}],

[0xD8, function() {
  wO('0xD8: gPRINT , ');
  Renderer.gPRINT(' ');
}],

[0xDA, function() {
  var y = Stack.ppi16();
  var x = Stack.ppi16();
  wO('0xDA: gLINEBY(' + x + ', ' + y + ')');
  Renderer.gLINEBY(x,y);
}],

[0xDB, function() {
  var height = Stack.ppi16();
  var width = Stack.ppi16();
  wO('0xDB: gBOX(' + width + ', ' + height + ')');
  Renderer.gBOX(width, height);
}],

[0xDF, function() {
  var fillMode = Stack.ppi16();
  var height = Stack.ppi16();
  var width = Stack.ppi16();
  wO('0xDF: gFILL(' + width + ', ' + height + ', ' + fillMode + ')');
  Renderer.gFILL(width, height, fillMode);
}],

[0xE3, function() {
  var arg = pB[++pc];
  wO('0xE3: gUPDATE ' + arg);
  Renderer.gUPDATE(arg);
}],

[0xE5, function() {
  var y = Stack.ppi16();
  var x = Stack.ppi16();
  wO('0xE5: gLINETO(' + x + ', ' + y + ')');
  Renderer.gLINETO(x,y);
}],

[0xF4, function() {
  var arg = pB[++pc];
  wO('0xF4: gBORDER ' + arg + ' - TODO');
  var args = [];
  for (var i = 0; i < arg; i++) {
    args.push(Stack.ppi16());
  }
  Renderer.gBORDER(args);
}],

[0x26, function() {
  var args = [];
  for (var i = 0; i < 5; i++) {
    args.push(Stack.ppi16());
  }
  
  wO('0x57 -> 0x26: gCREATE ' + args[4] + ', ' + args[3] + ', ' + args[2] + ', ' + args[1] + ', ' + args[0]);
  Stack.pi16(Renderer.gCREATE(args[4], args[3], args[2], args[1], args[0], 0));
}, 0x57],

[0x28, function() {
  var arg = pB[++pc];
  
  wO('0x57 -> 0x28: gLOADBIT - TODO');
  var args = [];
  for (var i = 0; i < arg; i++) {
    args.push(Stack.ppi16());
  }
}, 0x57],

[0x2A, function() {
  wO('0x57 -> 0x2A: gRANK');
  Stack.pi16(Renderer.GetIndexForID(Renderer.ActiveID));
}, 0x57],

[0x2C, function() {
  wO('0x57 -> 0x2C: gX');
  Stack.pi16(Renderer.gX());
}, 0x57],

[0x2D, function() {
  wO('0x57 -> 0x2D: gY');
  Stack.pi16(Renderer.gY());
}, 0x57],

[0x2E, function() {
  wO('0x57 -> 0x2E: gWIDTH');
  Stack.pi16(Renderer.gWIDTH());
}, 0x57],

[0x2F, function() {
  wO('0x57 -> 0x2F: gHEIGHT');
  Stack.pi16(Renderer.gHEIGHT());
}, 0x57],

[0x30, function() {
  wO('0x57 -> 0x30: gORIGINX');
  Stack.pi16(Renderer.gORIGINX());
}, 0x57],

[0x31, function() {
  wO('0x57 -> 0x31: gORIGINY');
  Stack.pi16(Renderer.gORIGINY());
}, 0x57],

[0x32, function() {
  var arg = Stack.pps();
  var res = Renderer.gTWIDTH(arg);
  wO('0x57 -> 0x32: PUSH% the value(' + res + ') of gTWIDTH ' + arg);
  Stack.pi16(res);
}, 0x57],

[0x33, function() {
  var arg1 = Stack.ppi16();
  var arg2 = Stack.pps();
  wO('0x57 -> 0x33: gPRINTCLIP("' + arg2 + '", ' + arg1);
  Renderer.gPRINTCLIP(arg2, arg1);
}, 0x57],


[0x39, function() {
  var args = [];
  for (var i = 0; i < 6; i++) {
    args.push(Stack.ppi16());
  }
  
  wO('0x57 -> 0x39: gCREATE ' + args[5] + ', ' + args[4] + ', ' + args[3] + ', ' + args[2] + ', ' + args[1] + ', ' + args[0]);
  Stack.pi16(Renderer.gCREATE(args[5], args[4], args[3], args[2], args[1], args[0]));
}, 0x57],

[0x00, function() {
  wO('0xFF -> 0x00: gGREY - Ignored');
}, 0xFF],

[0x01, function() {
  Stack.ppd();
  
  wO('0xFF -> 0x01: DEFAULTWIN - Ignored');
  var curID = Renderer.gIDENTITY();
  Renderer.gUSE(1);
  Renderer.gCLS();
  Renderer.gUSE(curID);
}, 0xFF]

);