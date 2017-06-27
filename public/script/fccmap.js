//code from bl.ocks.org/mbostock was modified for the
//map and the zoom code.  The map can be moved around and
//zoomed into various areas.  It will not resize.
var width = 900,
    height = 700,
    scale0 = (width - 1) / 2 / Math.PI;

  //varibles for legend
  var legendRectSize = 18,
      legendSpacing = 4,
      color = d3.scaleOrdinal()
  .range([{'hue':"#b30000",'label':"< 250g"},
          {'hue':"#ff0000",'label':"< 500g"},
          {'hue':"#ff8000",'label':"< 1000g"},
          {'hue':"#ffd9b3",'label':"< 2500g"},
          {'hue':"#ffff1a",'label':"< 5000g"},
          {'hue':"#ffff66",'label':"< 25000g"},
          {'hue':"#003300",'label':"< 50000g"},
          {"hue":"#00ff00",'label':"< 250000g"},
          {"hue":"#0033cc","label":"< 500000g"},
          {"hue":"#00ccff","label":"< 2500000g"},
          {"hue":"#9900ff","label":"< 5000000g"},
          {"hue":"#cc33ff","label":"> 5000000g"}]);

//scale for the meteor size
var colorScale = d3.scaleQuantile()
    .domain([0,250,500,1000,2500,5000,25000,50000,250000,500000,2500000,5000000])
    .range(["#b30000","#ff0000",
            "#ff8000","#ffd9b3",
            "ffff1a","#ffff66",
            "#003300","#00ff00",
            "#0033cc","#00ccff",
            "#9900ff","#cc33ff"]);




$.getJSON("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json",function(meteors){
   // get the meteor
   var meteor = [];
   var year;
   //make sure the long and lat and year exist
   //missing long and lat is omitted ,missing put in for year
   for (var i =0;i<meteors.features.length;i++){
     if (meteors.features[i].geometry != null){
       if (meteors.features[i].properties.year != null){
         year = meteors.features[i].properties.year.slice(0,4);}
       else {year = "Missing"}
 meteor.push({"long":meteors.features[i].geometry.coordinates[0],"lat":meteors.features[i].geometry.coordinates[1],"name":meteors.features[i].properties.name,"mass":Number(meteors.features[i].properties.mass),"year":year,"class":meteors.features[i].properties.recclass})
     }
   };
//get the jsaon to create the map
//$.getJSON("https://crossorigin.me/https://bl.ocks.org/mbostock/raw/4090846/world-50m.json?format=json&action=query",function(world){


var url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";

//create the svg area
var svg = d3.select(".map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.zoom().on("zoom",function(){
      svg.attr("transform",d3.event.transform)
    }))

var g = svg.append("g");

var projection = d3.geoMercator()
  .scale(width/2/Math.PI)
  .translate([width/2,height/2])

//tooltip/create the tooltip
  var tooltip = d3.select(".details")
    .attr("class","tooltip")
    .style("opacity",0);

var path = d3.geoPath()
  .projection(projection);

d3.json(url,function(err,world){
  g.append("path")
    .attr("d",path(world))

//add meteors to map
  var circles = g.selectAll("circle")
    .data(meteor).enter()
    .append("circle")
    .attr("cx",function(d){
      return projection([d.long,d.lat])[0]})
    .attr("cy",function(d){
      return projection([d.long,d.lat])[1]})
    .attr("r","2px")
    .attr("fill",function(d){return colorScale(d.mass)})
    .on("mouseover",function(d){
      tooltip.transition()
        .duration(200)
        .style("opacity",.9);
      tooltip.html(d.name+"</br>Year: "+d.year+"</br>"+"long: "+d.long+"</br>lat: "+d.lat+
        "</br>mass: "+d.mass+" grams</br>class: "+d.class)
        .style("left",(d3.event.pageX)+"px")
        .style("top",(d3.event.pageY)+"px")
    })
    .on("mouseout",function(d){
      tooltip.transition()
        .duration(500)
        .style("opacity",0)
    });


    //add the legend
    var legend = svg.selectAll('.legend')
      .data(color.range())
      .enter()
      .append('g')
      .attr('class','legend')
      .attr('transform',function(d,i){
        var horz = 75;
        var vert = 400 + i*10;
        var outstr = 'translate('+horz+','+vert+')'
        return outstr;
      });
   legend.append('circle')
    .attr("r",3)
    .style("fill",function(d,i){
      return d.hue;
    })
    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - 15)
      .text(function(d){return d.label;});

  })
})
