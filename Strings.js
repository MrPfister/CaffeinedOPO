// Convert a C String formatted array to a regular string
// a = Array
// o = Offset
function CStr(a,o) {
  var l = a[o], r = "";
  for (var i = o + 1; i<=o+l; i++) {
    r += String.fromCharCode(a[i]);
  }
  return r;
}

// Convert a String to a C formatted string
function Str2CStr(s) {
  r = [s.length];
  for (var i = 0; i < r[0]; i++) {
    r.push(s.charCodeAt(i));
  }
  return r;
}

// Extract a QStr from an array
// a = Array
// o = Offset
// l = Length
function QStr(a,o,l) {
  r = "";
  for (var i = o; i<=o+l; i++) {
    r+=String.fromCharCode(a[i]);
  }
  return r;
}


// Compare two strings
function strcmp(a, b) {
    a = a.toString(), b = b.toString();
    for (var i=0,n=Math.max(a.length, b.length); i<n && a.charAt(i) === b.charAt(i); ++i);
    if (i === n) return 0;
    return a.charAt(i) > b.charAt(i) ? -1 : 1;
}