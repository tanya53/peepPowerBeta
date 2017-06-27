$(document).ready(function


 /* explain forces
  https://roshansanthosh.wordpress.com/2016/09/25/forces-in-d3-js-v4
  https://hi.stamen.com/forcing-functions-inside-d3-v4-forces-and-layout-transitions-f3e89ee02d12
  https://bl.ocks.org/mindrones/5a20e38c9654f540497754566d089c4d
  */
  var width = 800;
  var height = 400;

  //create the svg for the graph
  var svg = d3.select("#chart").append("svg")
    .attr("width",width)
    .attr("height",height)

  //set up the forces acting on the graph
  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody().strength(-10))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("link",d3.forceLink().distance(function(d){return 40}).strength(0.2))
      .force ("gravity",gravity(0.25));
  //seperate gravity function, hopefully pulls things back into the visible area
  function gravity(alpha){
    return function(d) {
      d.y += (d.cy - d.y) * alpha;
      d.x += (d.cx -d.x) * alpha;
    }
  }

  //get the data
  d3.json("https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json", function(error, json) {
    if (error) throw error;

    //create the tooltip
    var tooltip = d3.select(".testme")
        .attr("class","tooltip")
        .style("opacity",0);

    simulation
      .nodes(json.nodes)
      .force("link")
      .links(json.links);


    //add the links
    var link = svg.selectAll(".link")
        .data(json.links)
        .enter().append("line")
        .attr("class", "link");

    //add the flag images
     var node =d3.select('#flag').selectAll('img')
        .data(json.nodes)
        .enter()
        .append('img')
        .attr("class",function(d){return "flag flag-"+d.code;})
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .on("mouseover",function(d){
          console.log("country ",d.country);
          console.log(d3.event.pageX)
          console.log(d3.event.pageY)
          tooltip.transition()
            .duration(200)
            .style("opacity",.9);
          tooltip.html("<div>"+d.country+"<br/>"+d.code+"</div>")
            .style("left",(d3.event.pageX)+"px")
            .style("top",(d3.event.pageY) +"px")
        })
        .on("mouseout",function(d){
          tooltip.transition()
            .duration(500)
            .style("opacity",0)
        });

  /*  var label = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(json.nodes)
        .enter().append("text")
          .attr("class", "label")
          .text(function(d) { return d.country; });*/

    simulation.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
      node.style('left', function (d) { return d.x + 'px'; })
                 .style('top', function (d) { return d.y + 'px'; });

    /*label
          .attr("x", function(d) { return d.x; })
              .attr("y", function (d) { return d.y; })
              .style("font-size", "8px").style("fill", "#4393c3");*/

    });
  });

  //functions for the dragging
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
  }

  function dragged(d) {
   d.fx = d3.event.x;
   d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx=undefined;
    d.fy=undefined;
  }
});
