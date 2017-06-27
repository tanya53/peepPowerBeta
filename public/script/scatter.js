if(!d3.chart) d3.chart = {};
d3.chart.scatter = function (){
  var data;
  var g;
  var width = 400;
  var height = 400;

  function chart(container){
    console.log("in scatter");
    g = container;
    var maxScore = d3.max(data,function(d) {return d.data.score})
    var yScale = d3.scaleLinear()
    .domain([0,maxScore])
    .range([height,0])

    /*var xScale = d3.scaleBand()
      .domain(d3.range(data.length))
      .rangeRound([1,611])
      .padding(0.34)
    var xScale = d3.scale.ordinal()
    .domain(d3.range(data.length))
    .rangeBands([1,611],0.34)
*/
   var xScale = d3.scaleTime()
    .range([0,width])
    .domain(d3.extent(data,function(d) {return d.data.created}))

    var circles = g.selectAll("circle")
    .data(data)

    circles.enter()
    .append("circle")
    .attrs({
      cx: function(d,i){return xScale(d.data.created)},
      cy: function(d,i){return yScale(d.data.score)},
      r:10
    })
    circles.exit().remove()
  }

  chart.highlight = function(data){
    var circles = g.selectAll("circle")
      .style("stroke","")
    circles
      .data(data,function(d) {return d.data.id})
      .style("stroke","orange")
      .style("stroke-width",3)
      console.log("the in data is ",data);
      return 
  }

  chart.data=function(value){
    if(!arguments.length) return data;
    data=value;
    return chart;
  }
  chart.width = function(value){
    if(!arguments.length) return width;
    width = value;
    return chart;
  }
  chart.height = function(value){
    if(!arguments.length) return height;
    height = value;
    return chart;
  }


return chart
}
