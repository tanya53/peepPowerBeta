$(document).ready(function(){

//www.safaribooksonline.com/blog/2014/02/17/building-responsible-visualizations-d3-js/
//http://bl.ocks.org/nicolashery/9627333var margin = {top:45,right:20,bottom:70,left:60};
var margin = {top:45,right:20,bottom:70,left:60};
var width = 800-margin.left-margin.right;
var height = 800-margin.top-margin.bottom;
var dataset = [];

$.getJSON("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",function(data){
  dataset = data.data.slice(0,19);

  for (var i = 0;i<19;i++){
    dataset[i][0] = i;
  }

//create the tooltip
  var tooltip = d3.select(".details")
    .attr("class","tooltip")
    .style("opacity",0);

  var colors = d3.scaleOrdinal(d3["schemeCategory20"]);
  //create the x scale
  var xExtent = d3.extent(dataset,d => d[0]);
  var xScale = d3.scaleLinear()
    .domain([0,18])
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
  var rect = svg.selectAll('circle')
    .data(dataset)
    .enter().append('circle')
    .attr('cx',function(d) {return xScale(d[0])})
    .attr('cy',function(d) {return yScale(d[1])})
    .attr('r',function(d){return 10})
    .attr('fill',function(d,i){return colors(d)})
    .on("mouseover",function(d){
      tooltip.transition()
        .duration(200)
        .style("opacity",.9);
      tooltip.html(d[0]+"<br/>"+d[1])
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
    .text("The Race to Convert the Human Species to Peepism");

  svg.append("text")
    .attr("class","axislabel")
    .attr("x",(width/2))
    .attr("y",height-margin.top-margin.bottom)
    .attr("text-anchor","middle")
    .text("Number of Conversion Attempts");

 svg.append("text")
  .attr("class","axislabel")
  .attr("transform","rotate(-90)")
  .attr("y",50)
  .attr("x",-height/2)
  .attr("text-anchor","middle")
  .text("Successful Conversions");

});

});
