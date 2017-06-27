$(document).ready(function(){
var display = d3.select("#display");
var url =  "http://www.reddit.com/r/pics.json?limit=40";

$.ajax({
  type: 'GET',
  url: url,
  dataType: 'jsonp',
  success: function(data2) {created3(data2); },
  error: function() { console.log('Uh Oh!'); },
  jsonp: 'jsonp'
});

function created3(data2){
  var data = data2.data.children;
  data.forEach(function(d){
    d.data.created *= 1000;
  })
  console.log("data ",data);
  //table
  var display = d3.select("#display");
  var tdiv = display.append("div").classed("table",true);
  var table = d3.chart.table();
  table.data(data);
  table(tdiv);

  //scatter plot
  var svg = d3.select("svg")
  var sgroup = svg.append("g");
  var scatter = d3.chart.scatter()
  scatter.data(data)
  scatter(sgroup)

  //brush
  var bgroup = svg.append("g")
  .attr("transform","translate(50,410)")
  var brush = d3.chart.brush()
  brush.data(data)
  .width(800)
  brush(bgroup)
  brush.on("filter",function(filtered){
    console.log("filtered",filtered)
    scatter.data(filtered)
    scatter(sgroup)
  });
  table.on("hover",function(hovered){
    scatter.highlight(hovered);
  })
  //scatter.highlight(data.slice(0,10));


}

});
