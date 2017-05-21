<!--

var canvas = new fabric.Canvas('c', { selection: false });
var gridSize = 50;

// create a triangular grid
triHeight = gridSize * Math.sin(Math.PI / 3);
offset = 0;

for (var i = 0; i < (600 / gridSize); i++) {
  for (var j = 0; j < (600 / gridSize) + 1; j++) { // the +1 is to draw all the way to the right edge
    if (i % 2 == 0) {
      offset = 0;
    } else {
      offset = -gridSize/2;
    }
    canvas.add(new fabric.Triangle({ 
      top: i*triHeight, 
      left: offset + j*gridSize,
      width: gridSize, 
      height: triHeight, 
      stroke: '#ddd', 
      fill:'#fff', 
      selectable:false
    }));
  }
}

// snap to grid
canvas.on('object:moving', function(options) { 
  if (Math.round(options.target.top / gridSize) % 2 == 1) {
    // odd numbered rows
    options.target.set({
      left: Math.round(options.target.left / gridSize) * gridSize - gridSize/2,
      top: Math.round(options.target.top / gridSize) * triHeight
    });    
  } else {
    // even numbered rows -- offset by half a grid unit
    options.target.set({
      left: Math.round(options.target.left / gridSize) * gridSize,
      top: Math.round(options.target.top / gridSize) * triHeight
    });    
  }
});

// add a hex HC to the canvas
function addHex(event) {
  var offset = 0.5 * gridSize; // necessary for text to align properly when grouped with the hexagon
  var verts = [{x: offset, y: 0},
               {x: offset + gridSize, y: 0},
               {x: offset + 1.5*gridSize, y: triHeight},
               {x: offset + gridSize, y: 2*triHeight},
               {x: offset, y: 2*triHeight},
               {x: offset - 0.5*gridSize, y: triHeight}];

  // create the hc hexagon
  var hex = new fabric.Polygon(verts, { 
    fill: event.data.color, 
    stroke: '#fff',
    originX: 'center', 
    originY: 'center',
    centeredRotation: true,
    lockScalingX: true,
    lockScalingY: true,
    lockRotation: true
  }); 

  // create the hc / hex label
  var label = new fabric.Text(event.data.label, {
    fontFamily: 'Helvetica',
    fontWeight: 'regular',
    fontSize: 10,
    fill: "#fff",
    originX: 'center',
    originY: 'center'
  });

  // group the hexagon and the label
  // hide the scale and rotation handles for the group object
  var group = new fabric.Group([ hex, label ]);
  group.hasControls = false;
  group.hasBorders = false;

  // create the logo image 
  // apparently the group must exist before the image is created and added
  fabric.Image.fromURL('minerva-circle-sm.png', function(oImg) {
    var logo = oImg.scale(1.0).set({originX:'center', originY:'center'});
    group.add(logo);
    canvas.renderAll(); // kludge: otherwise the logo won't display until hexagon is moved
  });

  // add the group to the canvas
  group.setLeft(4 * gridSize);
  group.setTop(4 * triHeight);
  canvas.add(group);
}

// associate courses of introduction with their signature colors. Used to color the hexagons.
var colorMap = {
  "Complex Systems": "#016837",
  "Empirical Analyses": "#93071c",
  "Formal Analyses": "#06519b",
  "Multimodal Communications": "#e28812"
}

// when document is ready, retrieve HCs, parse, and add to a tree
$(document).ready(function() {
  $.getJSON("hcs.json", function(data) {
    $.each (data.HCgroups, function (i,item) {
      lielem = $('<li/>')
        .text(item.name)
        .addClass("group")
      $("#hclist").append(lielem);
      $.each (item.HCs, function (j,hc) {
        hcitem = $('<li/>')
          .text(hc.hashtag)
          .addClass("hc")
          .click({label:hc.hashtag,color:colorMap[hc.courseOfIntro]},addHex) // fancy jquery way to pass parameters to the handler
        lielem.append(hcitem);
      });
    });
  });
});

// -->