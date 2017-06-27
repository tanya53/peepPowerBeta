$(document).ready(function(){

  //<img src="blank.gif" class="flag flag-cz" alt="Czech Republic" />
  //above for flags.css and flags.png
  var svg = d3.select("svg");
  var width = 856;
  var height = 900;
  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody().strength(-10))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("link",d3.forceLink().distance(function(d){return 40}).strength(0.2))
      .force ("gravity",gravity(0.25));

  function gravity(alpha){
    return function(d) {
      d.y += (d.cy - d.y) * alpha;
      d.x += (d.cx -d.x) * alpha;
    }
  }

  d3.json("https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json", function(error, graph) {
    if (error) throw error;
    for (var i =0;i<graph.nodes.length;i++){
      graph.nodes[i].id = i;
    }
    console.log(graph.nodes);
    var link = svg.append("g")
                  .style("stroke", "#aaa")
                  .selectAll("line")
                  .data(graph.links)
                  .enter().append("line")


    var node = svg.append("g")
              .attr("class", "nodes")
              .selectAll("circle")
              .data(graph.nodes)
              .enter().append("circle")
              .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

    var label = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
          .attr("class", "label")
          .text(function(d) { return d.country; });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node
           .attr("r", 10)
           .style("fill", "red")
           .style("stroke", "#969696")
           .style("stroke-width", "1px")
           .attr("cx", function (d) { return d.x+6; })
           .attr("cy", function(d) { return d.y-6; });

      label
      		.attr("x", function(d) { return d.x; })
              .attr("y", function (d) { return d.y; })
              .style("font-size", "8px").style("fill", "#4393c3");
    }
  });

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
