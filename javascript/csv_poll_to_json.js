$(function(){
  statePollSet = function(data) {
    var i = 0;
    var lines = 0;
    var j = data.search(/,/i);
    var polls = {
      demEv: 0,
      repEv: 0
    }
    
    next = function(regex) {
      var text = data.slice(i, j++);
      data = data.slice(j);
      j = data.search(/,/i);
      return text;
    }
    searchDate = function() {
      j = data.search(/\n/i);
    }
    
    favors = function(ev, dem, rep) {
      votes = parseInt(ev);
      if (parseInt(dem) > parseInt(rep)) {
        polls.demEv += votes;
        return "Dem";
      } else {
        polls.repEv += votes;
        return "Rep"
      }
    }
      
    while(lines < 51) {
      var state = next();
      var ev = next();
      var dem = next();
      var rep = next();
      var ind = next();
      searchDate();
      var date = next();
      var stateVal = state.replace(/[\.\ ]/g, '_').toLowerCase();
      polls[stateVal] = {
        state: state,
        ev: ev,
        dem: dem,
        rep: rep,
        ind: ind,
        date: date,
        favors: favors(ev, dem, rep)
      };
      lines++;
    }
    return polls;
  }
});