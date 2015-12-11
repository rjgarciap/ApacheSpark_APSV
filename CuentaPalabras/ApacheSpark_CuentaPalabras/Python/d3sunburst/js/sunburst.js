var width = 550,
    height = 700,
    radius = Math.min(width, height)*3 / 7;

var x = d3.scale.linear()
        .range([0, 2 * Math.PI]);

var y = d3.scale.linear()
        .range([0, radius]);

var color = d3.scale.category20c();
var flagspark=1;
var flaghadoop=1;

function sunburstspark(){


var svg = d3.select("#graphspark").append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + (width / 2 )+ "," + (height / 2 + 10) + ")");

var partition = d3.layout.partition()
                .value(function(d) { return d.size; });

var arc = d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
        .innerRadius(function(d) { return Math.max(0, y(d.y)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });
var img = svg.append("svg:image")
    .attr("xlink:href", "images/quijotespark.png")
    .attr("width", 200)
    .attr("height", 200)
    .attr("x", -100)
    .attr("y",-100);

d3.json("dataspark.json", function(error,root) {
          var g = svg.selectAll("g")
                 .data(partition.nodes(root))
                 .enter().append("g")
                 .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring;
          var path = g.append("path")
                    .attr("d", arc)
                    .style("fill", function(d) { return color(d.name); })
 g.each(function(d){

    
    var thisnode= d3.select(this);

    var dify=thisnode[0][0].childNodes[0].__data__.dy//Vertical space to write the text
    var difx=thisnode[0][0].childNodes[0].__data__.dx//Horizontal space to write
          thisnode.append("title")
                     .text(function(d) { return d.name+":"+d.size; });
          
          if(difx>0.001){//See if the space to the text is too small to display it

            if(thisnode[0][0].childNodes[0].__data__.children==undefined){//It is the last level?

              var text = thisnode.append("text")
                    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
                      .attr("fill", "black")
                      .style("font-family", "Century Gothic,CenturyGothic,AppleGothic,sans-serif")  
                      .style("font-size", dify*20+"px")
                     .attr("dx", "-14") // margin
                     .attr("dy", ".35em") // vertical-align
                     .text(function(d) { return d.name; });

      
      }}

  });
});

d3.select(self.frameElement).style("height", height + "px");
d3.select(self.frameElement).style("width", width + "px");
}

function sunbursthadoop(){


var svg = d3.select("#graphhadoop").append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + (width / 2 )+ "," + (height / 2 + 10) + ")");

var partition = d3.layout.partition()
                .value(function(d) { return d.size; });

var arc = d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
        .innerRadius(function(d) { return Math.max(0, y(d.y)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });
var img = svg.append("svg:image")
    .attr("xlink:href", "images/quijotehadoop.png")
    .attr("width", 200)
    .attr("height", 200)
    .attr("x", -100)
    .attr("y",-100);

d3.json("datahadoop.json", function(error,root) {
          var g = svg.selectAll("g")
                 .data(partition.nodes(root))
                 .enter().append("g")
                 .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring;
          var path = g.append("path")
                    .attr("d", arc)
                    .style("fill", function(d) { return color(d.name); })
 g.each(function(d){

    
    var thisnode= d3.select(this);

    var dify=thisnode[0][0].childNodes[0].__data__.dy//Vertical space to write the text
    var difx=thisnode[0][0].childNodes[0].__data__.dx//Horizontal space to write
          thisnode.append("title")
                     .text(function(d) { return d.name+":"+d.size; });
          
          if(difx>0.001){//See if the space to the text is too small to display it

            if(thisnode[0][0].childNodes[0].__data__.children==undefined){//It is the last level?

              var text = thisnode.append("text")
                    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
                      .attr("fill", "black")
                      .style("font-family", "Century Gothic,CenturyGothic,AppleGothic,sans-serif")  
                      .style("font-size", dify*20+"px")
                     .attr("dx", "-14") // margin
                     .attr("dy", ".35em") // vertical-align
                     .text(function(d) { return d.name; });

      
      }}

  });

});

d3.select(self.frameElement).style("height", height + "px");
d3.select(self.frameElement).style("width", width + "px");
}

window.setInterval(function(){
d3.json("dataspark.json", function(error, root) {reloadsunburstspark(root) });}, 50);
window.setInterval(function(){
d3.json("datahadoop.json", function(error, root) {reloadsunbursthadoop(root) });}, 50);


function reloadsunburstspark(root){
  if(flagspark){
  if(root){
    console.log("aa")
    sunburstspark()
    flagspark=0;

  }}
}
function reloadsunbursthadoop(root){
  if(flaghadoop){
  if(root){
    console.log("ss")
    sunbursthadoop() 
    flaghadoop=0;
  }
}
}
// Interpolate the scales!

function computeTextRotation(d) {//Rotate the text
        var ang = (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
        return (ang > 90) ? 180 + ang : ang;
  }



 