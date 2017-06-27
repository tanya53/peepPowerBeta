if(!d3.chart) d3.chart = {};
d3.chart.table = function (){
  var data;
  var width;

  //imported from m github
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
  var dispatch = d3.dispatch(chart,"hover");
  function chart(container){
    console.log("container",container);
    console.log("data in function",data);
    var table = container.append("table")
    var rows = table.selectAll("tr.row")
    .data(data)

    var rowsEnter =rows.enter()
    .append("tr").classed("row",true)

    rowsEnter.append("td")
    .text(function(d){ return d.data.score});

    rowsEnter.append("td")
    .append("a")
    .attrs({
      href:function(d){return d.data.url}
    })
    .append("img")
    .attrs({
      src:function(d) {return d.data.thumbnail}
    })
    .styles({width:"60px"})

    rowsEnter.append("td")
    .append("a")
    .attrs({
      href:function(d) {return d.data.url}
    }).text(function(d){return d.data.title})

    rowsEnter.append("td")
    .text(function(d) {return d.data.ups})

    rowsEnter.append("td")
    .text(function(d){return d.data.downs})

    rows.exit().remove()

    rowsEnter.on("mouseover",function(d){
      d3.select(this).style("background-color","red")
      //dispatch.hover([d])
    })

    rowsEnter.on("mouseout",function(d){
      d3.select(this).style("background-color","")
      //dispatch.hover([])
    })
  }
  chart.data=function(value){
    if(!arguments.length) return data;
    data=value;
    return chart;
  }


//return chart
return d3.rebind(chart,dispatch,"on");
}
