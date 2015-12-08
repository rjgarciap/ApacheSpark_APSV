
var diameter = 500,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

d3.json("data.json", function(error, root) {
  if (error) throw error;

  var node = svg.selectAll(".node")
      .data(bubble.nodes(classes(root))
      .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d,i) { return color(d.className); });

  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.className.substring(0, d.r / 3); });
});


window.setInterval(function(){
  d3.json("data.json", function(error, root) {changebubble(root) });
}, 5000);


  // setTimeout(function(){ d3.json("data.json", function(error, root) {changebubble(root) });}, 5000);
  // setTimeout(function(){ d3.json("data.json", function(error, root) {changebubble(root) });}, 10000);
   //setTimeout(function(){ d3.json("data.json", function(error, root) {changebubble(root) });}, 15000);
   //setTimeout(function(){ d3.json("data.json", function(error, root) {changebubble(root) });}, 20000);

//update function
function changebubble(root) {
    var node = svg.selectAll(".node")
        .data(
            bubble.nodes(classes(root)).filter(function (d){return !d.children;}),
            function(d) {return d.className} // key data based on className to keep object constancy
        );
    
    // capture the enter selection
    var nodeEnter = node.enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    
    // re-use enter selection for circles
    nodeEnter
        .append("circle")
        .attr("r", function (d) {return d.r;})
        .style("fill", function (d) {return color(d.className);})
    
    // re-use enter selection for titles
    nodeEnter
        .append("title")
        .text(function (d) {
            return d.className + ": " + format(d.value);
        });
    nodeEnter.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.className.substring(0, d.r / 3); });
    
    node.select("circle")
        .transition().duration(1000)
        .attr("r", function (d) {
            return d.r;
        })
        .style("fill", function (d, i) {
            return color(d.className);
        });

    node.transition().attr("class", "node")
        .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    });

    node.exit().remove();
  }

    // Returns a flattened hierarchy containing all leaf nodes under the root.
    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function (child) {
                recurse(node.name, child);
            });
            else classes.push({
                packageName: name,
                className: node.name,
                value: node.size
            });
        }

        recurse(null, root);
        return {
            children: classes
        };
    }

    //d3.select(self.frameElement).style("height", diameter + "px");


// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");