$(document).ready(function(){
  //url for the data
  url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  var months = ["Jan.","Feb.","March","April","May","June","July","Aug.","Sep.",
            "Oct.","Nov.","Dec."];
  var legendlabel = [0,2.7,4.0,5.4,6.8,8.1,9.5,11,12.5];
  var numcolors=9;
  var legendRectSize = 18;

  //set up the svg area
  var margin = {top:10,right:20,bottom:70,left:110},
      w = 900 - margin.right - margin.left,
      h = 408-margin.top - margin.bottom;


  //get the data
  $.getJSON(url,function(data){

    var basetemp = data.baseTemperature;
    var tempdata = data.monthlyVariance;
    var yeardata = tempdata.map(function(obj){
      return obj.year;
    });
    //finds the start of the next year - true others return false
    yeardata = yeardata.filter(function(v,i){
      return yeardata.indexOf(v)==i;
    })

    var variancedata = tempdata.map(function(obj){
      return obj.variance;
    })


    var lowvariance = d3.min(variancedata);
    var highvariance = d3.max(variancedata);
    var lowyear = d3.min(yeardata);
    var highyear = d3.max(yeardata);
    var mindate = new Date(lowyear,0);
    var maxdate  = new Date(highyear,0);

    var tilewidth = w/yeardata.length;
    var tileheight = h/months.length;

  var colors = d3.scaleOrdinal(d3["schemeCategory20"]);
    var colorScale = d3.scaleQuantile()
        .domain([lowvariance + basetemp,highvariance+basetemp])
        .range([0,19])
        //.range(colorbrewer.Y10rRd[9])

    var xScale = d3.scaleLinear()
                 .domain([lowyear,highyear])
                 .range([0,w])

    var yScale = d3.scaleOrdinal()
                 .domain(months)
                 //.rangePoints([0,h]);
                 .range([0,h]);


    var xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(10)
                .tickFormat(d3.format("d"));


    var yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(10)
                .tickSize(0);

    //create svg area
    var svg = d3.select(".chart").append("svg")
              .attr("width",w + margin.left+margin.right)
              .attr("height",h + margin.top+margin.bottom)
              .append("g")
              .attr("transform","translate("+margin.left+","+margin.top+")");

    //x-axis
    svg.append("g")
       .attr("class","x axis")
       .attr("transform","translate(0,"+(h+1)+")")
       .call(xAxis)


   svg.append("text") //x-axis label
      .attr("x",w/2)
      .attr("y",h+(margin.bottom*3)/3)
      .style("text-anchor","middle")
      .text("Year")

   //y-axis labels, centered in row
     var ylabel = svg.selectAll(".ylabel")
        .data(months)
        .enter().append("text")
        .text(function(d){return d;})
        .attr("x",0)
        .attr("y",function(d,i){
          return i * tileheight;
        })
        .style("text-anchor","end")
        .attr("transform","translate(-6,"+tileheight/1.5 +")")

   svg.append("text")//text label for y-axis
      .attr("transform","rotate(-90)")
      .attr("y",-80)
      .attr("x",-120)
      .attr("dy",".71em")
      .style("text-anchor","end")
      .text("Month")

   // add the tool-tip
    var div=d3.select(".chart").append("div")
            .attr("class","tooltip")
            .style("opacity",0);

   //display the data
  svg.selectAll(".tile")
      .data(tempdata,function(d){
     return (d.year +":"+d.month);
   })
      .enter().append("rect")
      .attr("class","tile")
      .attr("x",function(d){
         return (d.year - lowyear)*tilewidth;})
      .attr("y",function(d){return (d.month-1)*tileheight;})
      .attr("rx",0)
      .attr("ry",0)
      .attr("width",tilewidth)
      .attr("height",tileheight)
  .attr('fill',function(d,i){return colors(d)})
      //.style("fill",function(d){
      //   return colorScale(d.variance+basetemp);})
     .on("mouseover", function(d) {	//tooltip code
         div.transition()
          .duration(200)
          .style("opacity", .9);
       div.html(months[d.month -1]+" "+
               d.year+"</br>"+ (d.variance+basetemp).toFixed(1) + "&degC"+"<br/>"+
               d.variance + "&degC")
          .style("left", (d3.event.pageX+5) + "px")
          .style("top", (d3.event.pageY - 50) + "px");
            })
       .on("mouseout", function(d) {
             div.transition()
             .duration(400)
             .style("opacity", 0);});


   //add a legend
  var legend = svg.selectAll(".legend")
     .data(d3["schemeCategory20"])
     .enter().append("g")
     .attr("class","legend")
     .attr("transform",function(d,i){return "translate("+(500+i*30)+","+(h+30)+")"});


    legend.append("rect")
      .attr("width",30)
      .attr("height",20)
      .style("fill",function(d,i){
      return d;
    });

    legend.append("text")
      .attr('x',legendRectSize-10)
      .attr('y',legendRectSize+15)
      .text(function(d,i){
      return legendlabel[i]});

  })
});
