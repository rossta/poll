$(function(){
  formatCSV = function(data) {
    var lines = [];
    var STATES = 50;
    var formatted;
    for(var i = 0; i <= STATES; i++) {
      var m = 0;
      var n = data.search(/\n/i) ? data.search(/\n/i) : continue;
      lines << data.slice(n);
      data = data.slice(n, data.length);
    }
    console.log(lines);
    return lines;
  }

});