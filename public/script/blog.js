function createEntries(data){
  //convert input to json
  var logs = JSON.parse(data);
  for (var i=0;i<logs.length;i++){
    var logentry = "<div><p>"+logs[i].date+"</p><h1>"+logs[i].title+"</h1><p>"+logs[i].entry+"</p></div>";

    $(".blog").append(logentry);
  }

}
$(document).ready(function(){
  console.log("we are here");
  var apiUrl = window.location.origin + '/shiplogs';
  console.log("apiUrl ",apiUrl);
  //need to get the logs
  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET',apiUrl,"",function(data){
    console.log("made ajax request");
    console.log("data ",data);
    createEntries(data);
  }));
});
