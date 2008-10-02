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
    var data;
    if(window.widget) { 
      pollData = widget.system("/bin/sh curl_polls.sh", null).outputString;
      if(pollData) {
        data = widget.system("/bin/sh format_input.sh " + pollData, null).outputString;
      }
    }
    return data;
  }
  
  stringToValue = function(text) {
    return text.replace(/[\.\ ]/g, '_').toLowerCase();
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
    
    var data = getTodaysPolls();
    var source = "";
    if(data) {
      source = "www.electoral-votes.com : current";
      console.log("from system");
      completeSetup(data, source);
    } else {
      $.ajax({
        type: "GET",
        url: "latest_polls.csv", 
        dateType: "csv",
        error: function() {
          console.log("Error loading data");
        },
        success: function(data){
          console.log("from archive");
          source = "www.electoral-votes.com : archive";
          completeSetup(data, source);
        }
      });
    }
  }
  
  completeSetup = function(data, source) {
    US.polls = statePollSet(data);
    setSelectOptions(stateSelect[0]);
    $("#source").text(source);
    $("#demEv span").text(US.polls.demEv);
    $("#repEv span").text(US.polls.repEv);
    displayFor(stateSelect[0].value);
  }  

  setup();
  stateSelect.change(function(){
    $(this).each(function(){
      display = this.value;
      displayFor(display);
    });
  });

});