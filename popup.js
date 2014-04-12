var background = chrome.extension.getBackgroundPage();
var tabTree = background.tabTree;

chrome.tabs.update(1266, {url: 'https://google.com'});

//treeData
var treeData = [
  {
    "name": "Top Level",
    "parent": "null",
    "children": [
      {
        "name": "Level 2: A",
        "parent": "Top Level",
        "children": [
          {
            "name": "Son of A",
            "parent": "Level 2: A"
          },
          {
            "name": "Daughter of A",
            "parent": "Level 2: A"
          }
        ]
      },
      {
        "name": "Level 2: B",
        "parent": "Top Level"
      },
      {
	"name": "Level 2: C",
	"parent": "Top Level"
      }
    ]
  }
];




var margin = {top: 40, right: 120, bottom: 20, left: 120};
var width = 960 - margin.right - margin.left;
var height = 500 - margin.top - margin.bottom;

var i = 0;

var tree = d3.layout.tree()
		.size([height, width]);

var diagonal = d3.svg.diagonal()
		.projection(	function(d) {
					return [d.x, d.y];
				});

var svg = d3.select("body").append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData[0];
update(root);

function update(source){
	var nodes = tree.nodes(root).reverse();
	var links = tree.links(nodes);

	nodes.forEach(	function(d){
				d.y = d.depth * 100;	
			});

	var node = svg.selectAll("g.node")
			.data(nodes,	function(d){
						return d.id || (d.id = ++i);
					});

	var nodeEnter = node.enter().append("g")
			.attr("class", "node")
			.attr("transform",	function(d){
							return "translate(" + d.x + "," + d.y + ")"; 
						});

	nodeEnter.append("circle")
			.attr("r", 10)
			.style("fill", "#fff");

	nodeEnter.append("text")
			.attr("y", 	function(d){
						return d.children || d._children ? -18 : 18;
					})
			.attr("dy", ".35em")
			.attr("text-anchor", "middle")
			.text(	function(d){
					return d.name;
				})
			.style("fill-opacity", 1);

	var link = svg.selectAll("path.link")
			.data(links,	function(d){
						return d.target.id;
					});

	link.enter().insert("path", "g")
			.attr("class", "link")
			.attr("d", diagonal);
}
