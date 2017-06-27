$(document).ready(function(){

//www.safaribooksonline.com/blog/2014/02/17/building-responsible-visualizations-d3-js/
//http://bl.ocks.org/nicolashery/9627333var margin = {top:45,right:20,bottom:70,left:60};
var margin = {top:45,right:20,bottom:70,left:60};
var width = 800-margin.left-margin.right;
var height = 800-margin.top-margin.bottom;
var dataset = [];

$.getJSON("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",function(data){
  dataset = data.data;
  console.log(dataset.length,dataset);
  console.log(dataset[0]);
  console.log(d3.extent(dataset,d => d[0]));
  console.log(d3.extent(dataset,d => d[1]));

  var parseTime = d3.timeParse("%Y-%m-%d");
  var formatTime = d3.timeFormat("%B, %Y");

console.log(dataset[0][0],dataset[0][1]);
  for (var i = 0;i<275;i++){
    //dataset[i][0] = i;

    dataset[i][0] = parseTime(dataset[i][0]);
  }
console.log("after ",dataset[0][0],dataset[0][1]);
//create the tooltip
  var tooltip = d3.select(".details")
    .attr("class","tooltip")
    .style("opacity",0);

  var colors = d3.scaleOrdinal(d3["schemeCategory20b"]);
  //create the x scale
  var xExtent = d3.extent(dataset,d => d[0]);
  var xScale = d3.scaleTime()
    //.domain([0,274])
    .domain(xExtent)
    .range([0,width-margin.right]);
  //create the y scale
  var yMax = d3.max(dataset,d =>d[1]);

  var yScale = d3.scaleLinear()
    .domain([yMax,0])
    .range([0,500]);

  var heightScale = d3.scaleLinear()
    .domain([yMax,0])
    .range([500,0]);

  //create the rectangles
  var svg = d3.select("#myChart").append("svg")
    .attr("width",width+margin.left+margin.right)
    .attr("height",height+margin.bottom+margin.top)
    .append('g')
    .attr('transform','translate('+margin.left+','+margin.right+')');
var teststr = "made it here";
  var rect = svg.selectAll('rect')
    .data(dataset)
    .enter().append('rect')
    .attr('width',2)
    .attr('height',function(d){return heightScale(d[1])})
    .attr('x',function(d) {return xScale(d[0])})
    .attr('y',function(d) {return yScale(d[1])})
    .attr('fill',function(d,i){return colors(d)})
    .on("mouseover",function(d){
      tooltip.transition()
        .duration(200)
        .style("opacity",.9);
      tooltip.html(formatTime(d[0])+"<br/>"+d[1])
        .style("left",(d3.event.pageX)+"px")
        .style("top",(d3.event.pageY)+"px")
    })
    .on("mouseout",function(d){
      tooltip.transition()
        .duration(500)
        .style("opacity",0)
    });

  var xAxis = d3.axisBottom()
  .scale(xScale);
  var yAxis = d3.axisLeft()
  .scale(yScale);

  svg.append('g')
  .attr('transform','translate('+[0,500]+')')
  .call(xAxis);

  svg.append('g')
  .attr('transform','translate('+[0,0]+')')
  .call(yAxis);

  svg.append("text")
    .attr("class","title")
    .attr("x",(width/2))
    .attr("y",(0))
    .attr("text-anchor","middle")
    .text("Number of Humans in Mind Meld");

  svg.append("text")
    .attr("class","axislabel")
    .attr("x",(width/2))
    .attr("y",height-margin.top-margin.bottom)
    .attr("text-anchor","middle")
    .text("this is the y axis");

 svg.append("text")
  .attr("class","axislabel")
  .attr("transform","rotate(-90)")
  .attr("y",50)
  .attr("x",-height/2)
  .attr("text-anchor","middle")
  .text("number of humans");

});

});
