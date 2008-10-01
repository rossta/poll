
$(function(){
  var US = {
  }
  var states = new Array("National","Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "D\.C\.", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming");
  
  var stateSelect = $("#states");
  var gDoneButton; 
  var gInfoButton;
  var front = $("#front")[0]; 
  var back = $("#back")[0];
  var display = $('#display');
  
  window.onfocus = function () {
  	$('states').focus();
  }

  $.fn.displayBar = function(value){
    var result = $(this).each(function(){
      bar = $(this).children(".bar")
      if(value > 0) {
        bar.text(value);
        bar.css("width", value + "%");
      } else {
        bar.text("0")
        bar.css("width", "0");
      }
    });
    return result;
  }
  
  createOption = function(text, value) {
    return new Option(text, value);
  }
  setSelectOptions = function(select) {
    select.options.length = 0;
    for(var i = 0; i < states.length; i++) {
      name = states[i]
      value = name.replace(/[\.\ ]/g, '_').toLowerCase();
      select.options[i] = createOption(name, value);
    }
    return select;
  }
   
  showPrefs = function() { 
    if (window.widget) 
    widget.prepareForTransition("ToBack"); 
    front.style.display="none"; 
    back.style.display="block"; 
    if (window.widget) 
    setTimeout ('widget.performTransition();', 0); 
  } 
  hidePrefs = function() { 
    if (window.widget) 
    widget.prepareForTransition("ToFront"); 
    back.style.display="none"; 
    front.style.display="block"; 
    if (window.widget) 
    setTimeout ('widget.performTransition();', 0); 
  }
  
  getTodaysPolls = function() {
    var urlCSV = "http://www.electoral-vote.com/evp2008/Pres/Excel/today.csv"
    var curlCSV = "curl " + urlCSV
    var extractColumns = "cut -d, -f 1,2,3,4,5,6"
    var trimRows = "grep -e '\(S[tu][am][ts]\)' -v"
    var saveFile = 'tee "polls-$(date +%F).csv"'
    var pipe = " | "
    var command = curlCSV + pipe + extractColumns + pipe + trimRows + pipe + saveFile
    
    if(window.widget) { 
      pollData = widget.system(command , displayResults).outputString; 
    }
  }
  
  stringToValue = function(text) {
    return text.replace(/[\.\ ]/g, '_').toLowerCase();
  } 
  
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
  
  $.fn.highlightFavorite = function(favors) {
    var result = $(this).each(function() {
      switch(favors) {
        case "Dem":
          $(this).addClass("favorsDem");
          $(this).removeClass("favorsRep");
          break;
        case "Rep":
          $(this).addClass("favorsRep");
          $(this).removeClass("favorsDem");
          break;
      }
      return true;
    });
    return result;
  }
  
  displayFor = function(value) {
    console.log("getting display for " + value + " data");
    
    if(value == "national") {
      nationalDisplay();
    } else {
      stateDisplayFor(value);
    }
  }
  
  nationalDisplay = function() {
    $('#state_display').hide();
    $('#national_display').show();
  }
  
  stateDisplayFor = function(stateVal) {
    var poll = US.polls[stateVal]
    $('#national_display').hide();
    $("#state").text(poll.state);
    $("#ev span").text(poll.ev);
    $("#dem").displayBar(poll.dem);
    $("#rep").displayBar(poll.rep);
    $("#ind").displayBar(poll.ind);
    $("#date span").text(poll.date);
    $("#poll").highlightFavorite(poll.favors);
    $("#demEv span").text(US.polls.demEv);
    $("#repEv span").text(US.polls.repEv);
    $('#state_display').show();
    return poll;
  }
  
  setup = function() {
    gDoneButton = new AppleGlassButton($("#doneButton")[0], "Done", hidePrefs); 
    gInfoButton = new AppleInfoButton($("#infoButton")[0], front, "white", "white", showPrefs);
    
    $.ajax({
      type: "GET",
      url: "polls-2008-09-29.csv", 
      dateType: "csv",
      error: function() {
        console.log("Error loading data");
      },
      success: function(data){
        US.polls = statePollSet(data);
        setSelectOptions(stateSelect[0]);
        $("#demEv span").text(US.polls.demEv);
        $("#repEv span").text(US.polls.repEv);
        displayFor(stateSelect[0].value);
      }
    });
  } 
  

  setup();
  stateSelect.change(function(){
    $(this).each(function(){
      display = this.value;
      displayFor(display);
    });
  });

});