if(!d3.chart) d3.chart = {};
d3.chart.brush = function (){
  var data;
  var g;
  var width = 600;
  var height = 30;
  var dispatch = d3.dispatch(chart,"filter");

  // Copies a variable number of methods from source to target.
d3.rebind = function(target, source) {
  var i = 1, n = arguments.length, method;
  while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
  return target;
};

// Method is assumed to be a standard D3 getter-setter:
// If passed with no arguments, gets the value.
// If passed with arguments, sets the value and returns the target.
function d3_rebind(target, source, method) {
  return function() {
    var value = method.apply(source, arguments);
    return value === source ? target : value;
  };
}



console.log("in the d3.chart.brush");
  function chart(container){
    console.log("in brush");
    g = container;

    var extent = d3.extent(data,function(d){
      return d.data.created
    })
    var max = d3.max(data,function(d) {return d.data.created})
    var min = d3.min(data,function(d) {return d.data.created})
    console.log("max ",new Date(max),"min",new Date(min))

    var scale = d3.scaleTime()
    .domain(extent)
    .range([0,width])

g.attr("class","brush")
    var brush = d3.brushX()
    .extent([[0,0],[width,height]])

    brush(g)
    g.selectAll("rect").attr("height",height)
    g.selectAll(".background")
      .styles({fill:"#f00",visibility:"visible"})
    g.selectAll(".extent")
      .styles({fill:"#00f",visibility:"visible"})
    g.selectAll(".resize rect")
      .styles({fill:"#0f0",visibility:"visible"})

    var rects = g.selectAll("rect.events")
    .data(data)
    rects.enter()
    .append("rect").classed("events",true)
    rects.attrs({
      x: function(d) {return scale(d.data.created);},
      y:0,
      width: 1,
      height:height
    }).style("pointer-events","none")

    rects.exit().remove()

  brush.on("end",function(){
      var ext=brush.extent()
      console.log("we are in the end",ext[0],ext[1])
      var filtered = data.filter(function(d) {
        console.log("@@@@@@@checking filtered");
        console.log((d.data.created > ext[0] && d.data.created < ext[1]))
        return (d.data.created > ext[0] && d.data.created < ext[1])
      })
      g.selectAll("rect.events")
      .style("stroke","")

      g.selectAll("rect.events")
      .data(filtered,function(d) {return d.data.id})
      .style("stroke","#0ff")

      //emit filtered data
      console.log("trying to dispatch");
      dispatch.call(chart,this,filtered);
    })

  /*  var axis = d3.axisBottom()
    //.scale(scale)
    //.tickValues([new Date(extent[0]),new Date(extent[0] + (extent[1] - extent[0])/2),new Date(extent[1])])
    var agroup = g.append("g")
    axis(agroup)
    agroup.selectAll("path")
      .style({fill:"none",stroke:"#000"})
    agroup.selectAll("line")
      .style({stroke:"#000"})*/
  var linear = d3.scaleTime()
    .domain([new Date(min),new Date(max)])
    .range([0,width])
  var axis = d3.axisBottom()
    .scale(linear)
    .ticks(3)
    .tickFormat(d3.timeFormat("%x %H:%M"))

  g.append("g")
    .attr("class","axis")
    .attr("transorm","translate(50,410)")
    .call(axis);
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


//return chart
return d3.rebind(chart,dispatch,"on");
}
