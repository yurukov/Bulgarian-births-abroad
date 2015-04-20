var inside = require('point-in-polygon');
var fs = require("fs");
var geojson = JSON.parse(fs.readFileSync("borders.json", "utf8"));

var coords = fs.readFileSync("glasuvam_coords.csv", "utf8");
coords=coords.trim().split("\n");

for (var k=0;k<coords.length;k++) {
  find(coords[k]);
}

function find(coords) {
  var point = coords.trim().split(",");
  point=[point[1],point[0]];
  for (var k=0;k<geojson.features.length;k++) {

    var feature = geojson.features[k];
    var shape = feature.geometry.coordinates;
    if (feature.geometry.type=='Polygon')
      shape=[shape];

    var isInside=false;
    for (var i=0;i<shape.length;i++) {
      for (var j=0;j<shape[i].length;j++) {
        if (inside(point, shape[i][j])) 
          isInside = j==0;
      }
      if (isInside)
        break;
    }

    if (isInside) {
      console.log(feature.properties.id+","+coords.trim());
      return;
    }
  }
  console.log('error,'+coords.trim());
}
