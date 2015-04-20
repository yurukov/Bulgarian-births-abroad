var inside = require('point-in-polygon');
var fs = require("fs");
var geojson = JSON.parse(fs.readFileSync("borders.json", "utf8"));

var dotmap = {};
var dotmapf = fs.readFileSync("dotmap.csv", "utf8");
dotmapf=dotmapf.trim().split("\n");
for (var k=0;k<dotmapf.length;k++) {
  dotmapf[k]=dotmapf[k].trim().split(",");
  if (!dotmap[dotmapf[k][0]])
    dotmap[dotmapf[k][0]]=[];
  dotmap[dotmapf[k][0]].push([parseFloat(dotmapf[k][2]),parseFloat(dotmapf[k][1])]);
}

var data = fs.readFileSync("births_abroad.csv", "utf8");
data=data.trim().split("\n");
data.shift();

var res={};
for (var k=0;k<data.length;k++) {
  data[k]=data[k].trim().split(",");
  var code = data[k][0];
  var maxb = data[k][1];
  if (maxb>100)
    maxb=100;
  var points = find(code, maxb);
  res[code]=points;
}
console.log(JSON.stringify(res));

function find(code,points) {
//  console.log(code+" "+points);
  for (var k=0;k<geojson.features.length;k++) 
    if (geojson.features[k].properties.id==code) {
      var feature = geojson.features[k];
      var borders=false,dotmapC=false;
      if (dotmap[code])
        dotmapC=dotmap[code];
      else
        borders = getBorders(feature);
      var dots = [];
  //    console.log(borders);
    //  console.log(dotmapC);
      var attempts = 0;
  
      while (dots.length<points && attempts<1000) {
        var dot;
        attempts++;
        if (dotmapC) {
          var refpoint = dotmapC.shift();
          dot = getCenterDot(refpoint);
          dotmapC.push(refpoint);
        } else {
          dot = getBorderDot(borders);
        }
        if (isInside(dot,feature))
          dots.push(dot);
      }
 
      if (dots.length>0)
        return dots;
    }
  console.log(code+',error');
  return false;
}

function isInside(point,feature) {
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
      return true;
  }
  return false;
}

function getBorders(feature) {
  var shape = feature.geometry.coordinates;
  if (feature.geometry.type=='Polygon')
    shape=[shape];
  var borders = [false,false,false,false];
  for (var i=0;i<shape.length;i++)
    for (var j=0;j<shape[i][0].length;j++) { 
        var dot = shape[i][0][j];
        if (dot[0]<borders[0] || borders[0]===false)
          borders[0]=dot[0];
        else if (dot[0]>borders[2] || borders[2]===false)
          borders[2]=dot[0];
        if (dot[1]<borders[1] || borders[1]===false)
          borders[1]=dot[1];
        else if (dot[1]>borders[3] || borders[3]===false)
          borders[3]=dot[1];
      }
  return borders;
}

function getBorderDot(borders) {
  return [Math.floor((Math.random()*(borders[2]-borders[0])+borders[0])*1000)/1000,
  Math.floor((Math.random()*(borders[3]-borders[1])+borders[1])*1000)/1000];
}

function getCenterDot(reference) {
  var r = Math.random()*0.3;
  var a = Math.random()*2*Math.PI;
  return [Math.floor((Math.sin(a)*r+reference[0])*1000)/1000,
    Math.floor((Math.cos(a)*r+reference[1])*1000)/1000]
}
