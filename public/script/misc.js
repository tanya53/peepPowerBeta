

      function initMap() {
        var myLatLng = {lat: -25.363,lng:131.044}
        var place, sign1, sign2

        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 1,
          center: {lat: -28.024, lng: 140.887},

        });
        //for (peepmarker in locations) {
        //  location = (peepmarker.lat,peepmarker.lng);


        for (var i=0;i<locations.length;i++){
          sign1 = 1;
          sign2 = 1;

          if (Math.random() > .5) {sign1 = -1}
          if (Math.random() > .5) {sign2 = -1}
          place = {lat: Math.random() * 83*sign1,lng:Math.random()*180*sign2}
          console.log(locations[i].title,place.lat,place.lng);
          var marker = new google.maps.Marker({
            position:place,
            map:map,
            title:locations[i].title,
            icon:locations[i].icon,
          });
        }
        /*calculate the number of tumblers to create*/
        var tumblerNbr = Math.floor(Math.random() * 10);
        console.log(tumblerNbr);
        for (var i = 0;i < tumblerNbr;i++){
          sign1 = 1;
          sign2 = 1;
          if (Math.random() > .5) {sign1 = -1}
          if (Math.random() > .5) {sign2 = -1}
          place = {lat: Math.random() * 83*sign1,lng:Math.random()*180*sign2}
          var eggMarker = new google.maps.Marker({
            position:place,
            map:map,
            title:"tumbler",
            label: "T",
            icon:{
            path: google.maps.SymbolPath.CIRCLE,
            scale:6.5,
            fillColor:"#f442eb",
            fillOpacity:0.4,
            strokeWeight:0.4
            }
          })
        }
      }

      var locations = [
        {title:"Tig",icon:'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'},
        {title:"Oliver",icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},
        {title:"Buffy",icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png'},
        {title:"Prudence",icon:'http://maps.google.com/mapfiles/ms/icons/green-dot.png'},
        {title:"Patti",icon:'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'},
        {title:"Petunia",icon:'http://maps.google.com/mapfiles/ms/icons/green-dot.png'},
        {title:"Hillary",icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png'},
        {title:"Martha",icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},
        {title:"LaLa",icon:'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'},
        {title:"Prince Sergio",icon:'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'},
        {title:"Princess Isabella",icon:'http://maps.google.com/mapfiles/ms/icons/green-dot.png'},
        {title:"Andre",icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png'},
        {title:"Konrad",icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},
        {title:"Peter",icon:'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'},
        {title:"George",icon:'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'},
        {title:"Laruence",icon:'http://maps.google.com/mapfiles/ms/icons/green-dot.png'},
        {title:"Leo",icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png'},
        {title:"Draco",icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},
        {title:"Gertrude",icon:'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'},
      ];
$(document).ready(function(){
    /*have to allow the geolocation, otherwise don't execute code */
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {

      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      const PEEPLAT = 47.4875;  /* setting from Bemidji Minnesota */
      const PEEPLONG = -94.8858;

      $.getJSON("https://ipinfo.io",function(location){
        $("#location").text("Bemidji, Minnesota");

        /*if not in the US use for weather search */
        if (location.country != "US") {
          location.region = location.country;}
        $("#location2").text(location.city+", "+location.region);

        /*using weather underground for the weather info */
        /*the two hits to weather underground are asynch */
        var str = "https://api.wunderground.com/api/9865d5d1f3370595/conditions/q/Minnesota/Bemidji.json";
        $.getJSON(str,function(weather){
              /*check to make sure valid info returned */
              if (weather.current_observation.temp_f){
                temp = weather.current_observation.temp_f;
                str= weather.current_observation.icon_url;
                var https_str = str.replace("http:","https:");
                $("#temp").text(weather.current_observation.temp_f + ' F');
                $("#icon1").html("<p><img id='img1' src="+https_str+" alt = 'weather icon' height = '150' width='150'></p>");
              }
        });
        var str = "https://api.wunderground.com/api/9865d5d1f3370595/conditions/q/"+location.region+"/"+location.city+".json";
        $.getJSON(str,function(weather){
                /*make sure the api returns valid data, if location not valid returns something else*/
                if (weather.current_observation.temp_f){
                  temp2 = weather.current_observation.temp_f;
                  str = weather.current_observation.icon_url;
                  var https_str2 = str.replace("http:","https:");
                  $("#temp2").text(weather.current_observation.temp_f + ' F');
                  $("#icon2").html("<p><img id = 'img2' src="+https_str2+" alt = 'weather icon' height = '150' width='150'></p>");
                  if (temp < temp2){
                    $("#visitinfo").after("<p>weather info from api.wunderground.com</p><div style = 'color:red;font-size:2em;' class='col-xs-12'>Peepmobile loaded, stock your frig!!!!</div>")
                  }else {
                    $("#visitinfo").after("<p>weather info from api.wunderground.com</p><div style = 'color:red;font-size:2em;' class='col-xs-12'>Too cold, staying here!!!</div>")
                  }
              }
        });
      });/*ipinfo*/
    });/*navigator */
  } /*if navigator*/
  console.log("before mymap()");
  /* js for the googlemaps for is there a peep near you? */
  function myMap(){
    console.log("we made it here");
    var mapProp = {
      center:new google.maps.LatLng(51.508742,-0.120850),zoom:5,
    };
    var map= new google.maps.Map(document.getElementById("googleMap"),mapProp);
  }
  console.log("after mymap()");
/********** pomodoro clock ************/
sound1 = "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3";
sound2 = "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"

var per;
var percent;
var relax;
var chore;
var time;
var clicked;
var c = new clock();


function clock(){
  this.choretime=25;
  this.resttime=25;
  this.session = chore;
  this.counter = 0;
  this.currenttime = this.choretime;
}

function initClock(){
 $("#session").text("Session");
 clicked =true;
 chore = 0;
 relax = 1;
 c.resttime = Number($("#rest_time").text());
 c.choretime = Number($("#chore_time").text());
 $("#current_time").text(minsec(c.choretime*60));
 c.current_time = c.choretime;

 c.session = chore;
 clicked = true;

}

$('#increase_rest').click(function() {
   if (clicked){
   c.resttime += 1;
   $("#rest_time").text(c.resttime);
   if (c.session == relax){
     c.counter = 0;
     c.currenttime = c.resttime*60;
     $("#current_time").text(minsec(c.currenttime));
     percent = (1/c.currenttime)*100;
   }
   }
    });

$('#decrease_rest').click(function(){
  if (clicked){
    c.resttime -=1;
    if (c.resttime <1){c.resttime=1;}
    $("#rest_time").text(c.resttime);
    if (c.session == relax){
      c.counter = 0;
      c.currenttime=c.resttime *60;
      $("#current_time").text(minsec(c.currenttime));
      percent =(1/c.currenttime)*100;
    }
  }
    });

$('#increase_chore').click(function() {
  if (clicked){
   c.choretime += 1;
   $("#chore_time").text(c.choretime);
   if (c.session == chore){
       c.counter = 0;
       c.currenttime=c.choretime *60;
       $("#current_time").text(minsec(c.currenttime));
       percent = (1/c.currenttime)*100;
   }
  }
   });

/*modified the chore time depending on sign clicks */
$('#decrease_chore').click(function() {
  if (clicked){
  c.choretime -=1;
  if (c.choretime <1){c.choretime =1;}
    $("#chore_time").text(c.choretime);
    if (c.session == chore){
      c.counter = 0;
      c.currenttime = c.choretime*60;
      $("#current_time").text(minsec(c.currenttime));
      percent = (1/c.currenttime)*100;
    }
  }
  });

 $('#load-bar-frame').click(function(){
   /*need to rotate between stopping and starting clock */
   if (clicked){
     clicked = false;
     if (c.session == chore){choretime();}
     else {resttime();}
   }
   else {clearInterval(time);
         clicked=true;}
 });

function str_pad_left(string,pad,length) {
return (new Array(length+1).join(pad)+string).slice(-length);}

function minsec(time){
 var minutes = Math.floor(time / 60);
 var seconds = time - minutes * 60;
 return str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
}

function choretime(){
 /*try using check current_time = chore_time*/
   c.session = chore
   $("#session").text("Session");
   c.currenttime = c.choretime *60;
   if (c.counter==0) {
     percent = (1/c.currenttime)*100;
     per = percent;
     c.counter = c.currenttime;
     $('#load-bar').css({background:"#b3ffff"});
   }
   time = setInterval(function () {
       --c.counter
       $("#current_time").text(minsec(c.counter));
       $('#load-bar').css({background: "linear-gradient(to top, #00ccff "+per+"%,transparent "+per+"%,transparent 100%)"});
       per = per + percent;
       if (c.counter == 0){
           clearInterval(time)
           var audio = new Audio(sound2);
           audio.play();
           resttime();
       }
       }, 1000);
}

function resttime(){
 $("#session").text("Break!");
 c.session = relax;
 c.currenttime = c.resttime * 60;
 if (c.counter ==0){
   percent = (1/c.currenttime)*100;
   per = percent;
   c.counter = c.currenttime;
 }
 time = setInterval(function () {
     --c.counter;
     $("#current_time").text(minsec(c.counter));
     $('#load-bar').css({background: "linear-gradient(to bottom, #00ccff "+per+"%,transparent "+per+"%,transparent 100%)"});
     per = per+percent;
     if (c.counter == 0){
         clearInterval(time)
         var audio = new Audio(sound2);
         audio.play();;
         choretime();
     }
    }, 1000);

}

initClock();

/*** calcualtor ***********/
equation = "";
ac = 0; /* sum of current equation, can be used as input*/
equal = false;

/* created the equation could be put back in click
   function, here from earlier attempt at problem. */
function add(addval){
equation = equation + addval;
$("#equation").val(equation);
}

$("button").click(function(){
 var val = $(this).attr("value");
 if (val =="CE"){
   equation=equation.slice(0,-1)
   $("#equation").val(equation);
 }
 else if (val =="AC"){
   console.log("resetting ac");
   ac = 0;
   equation="";
   $("#equation").val("");
 }
 else if (val == "="){
  console.log("in equal");
   /*prints error msg on calc and to console. */
   try{
     var result = eval(equation);
     $("#equation").val(result);
     }
   catch(e){
     console.log("there was an error",e);
     $("#equation").val("error");
   }
  equation ="";
  ac = result;
 }
 else {
   /*want to use previous total as input*/
   if ((equation.length ==0)&&(val=="%"||val=="*"||val=="/"||val=="+"||val=="-")){
     console.log("in add ac",ac);
     add(ac.toString());
   }
   add(val);
 }
 /*don't want to see what key was pressed */
 $(this).blur();

});
});
//});
