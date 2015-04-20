var fs = require("fs");
var geojson = JSON.parse(fs.readFileSync("dots.json", "utf8"));

var birthChance=
[0.08408,
0.07425,
0.08135,
0.07891,
0.08060,
0.08425,
0.09216,
0.09013,
0.09072,
0.08681,
0.07739,
0.07935];
var birthChanceI=[7,9,8,10,6,1,3,5,12,4,11,2];
var birthChanceD=[31,28,31,30,31,30,31,31,30,31,30,31];

var data = fs.readFileSync("births_abroad.csv", "utf8");
data=data.trim().split("\n");
data.shift();

//console.log("date,lat,lng");
for (var k=0;k<data.length;k++) {
  data[k]=data[k].trim().split(",");
  var code = data[k][0];
  for (var i=2;i<12;i++) {
    var count = parseInt(data[k][i]);
    if (count==0)
      continue;
    var months = splitM(count);
    var days = splitD(2002+i,months);
    var dots = getDots(code,count);
    days.forEach(function(v,i) {
      console.log(v+","+dots[i][0]+","+dots[i][1]);
    });
  }
}

function getDots(code,count) {
  var list = geojson[code];
  if (list.length<count) {
    var list1=[];
    for (var i=0;i<Math.ceil(count/list.length);i++)
      list1=list1.concat(list);
    list = list1;
  }
  list.sort(function() {return 0.5 - Math.random()});
  return list.slice(0,count);
}

function splitD(year,months) {
  var days=[];
  months.forEach(function(c,i) {
    for (var j=0;j<c;j++) {
      var date = Math.floor(Math.random()*birthChanceD[i])+1;
      days.push(year+"-"+(i+1<10?'0':'')+(i+1)+"-"+(date<10?'0':'')+date);
    }
  });
  return days;
}

function splitM(count) {
  var months=[];
  var sum=count;
  birthChance.forEach(function(f,i) {
    var v = Math.floor(count*f);
    sum-=v;
    months[i]=v;
  });
  if (sum>0) 
    for (var i=0;i<12 && sum>0;i++) {
      var v = Math.ceil(sum/(12-i));
      sum-=v;
      months[birthChanceI[i]-1]+=v;
    } 
  return months;
}

