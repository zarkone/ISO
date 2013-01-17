var s = [];
    // pokets' sizes
    s[0] = { w: 10, h: 15 };
    s[1] = { w: 15, h: 20 };


var params = {

  S     : s,     

};

window.r = (function (data) {

  
  var S = data.S.map (function (s) {
    
    var plane = new Array(s.w);
    var i = s.h-1, j;

    for (;i >= 0; i--) {
      
      j = s.w-1;
      plane[i] = new Array(j);
      for (;j >= 0; j--) {
        plane[i][j] = -1;
      }
    }
    return plane;

  }); 


  var r = {};
  r.S = S;

  return r;
})(params);