$(function (){
  // init canvas
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  //rectangle
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(0,0,150,75);
  ctx.fillStyle="#00ff00";
  //ctx.fillRect(x,y,width,height);
  ctx.fillRect(300,300,100,75);
  //line
  ctx.moveTo(150,75);
  ctx.lineTo(300,300);
  ctx.stroke();
  //circle
  //arc(x,y,r,startangle,endangle)
  ctx.beginPath();
  ctx.arc(225,225,25,0,2*Math.PI);
  ctx.stroke();

  //color gradients
  //createLinearGradient(x,y,x1,y1)
  //createRadialGradient(x,y,r,x1,y1,r1);
  //create gradient
  var grd=ctx.createLinearGradient(100,100,175,175);
  grd.addColorStop(0,"blue");
  grd.addColorStop(1,"yellow");
  ctx.fillStyle=grd;
  ctx.fillRect(100,100,75,75);

  // Create gradient
  var grd=ctx.createRadialGradient(325,115,80,375,300,0);
  grd.addColorStop(0,"red");
  grd.addColorStop(.5,"black");

  // Fill with gradient
  ctx.fillStyle = grd;
  ctx.fillRect(250,75,150,80);

  ctx.font="30px Arial";
  ctx.fillText("hello Peeps!",200,50);

  ctx.font="30px Arial";
  ctx.fillStyle="#0000ff";
  ctx.fillText("Hello Peeps Again",10,400);

  ctx.font="30px Arial";
  ctx.textAlign="center";
  ctx.strokeText("hello again",100,300);


/* clock */
var canvas= document.getElementById("clock");
var ctx2 = canvas.getContext("2d");
var radius = canvas.height/2;
ctx2.translate(radius,radius); //remap position (0,0), (radius,radius)
radius = radius *.90;
//drawClock();
setInterval(drawClock,1000); //called every 1000 millseconds

function drawClock(){
  drawFace(ctx2,radius);
  drawNumbers(ctx2,radius);
  drawTime(ctx2,radius);
}

function drawFace(ctx2,radius){
  var grad;
  //draw the white circle
  ctx2.beginPath();
  ctx2.arc(0,0,radius,0,2*Math.PI);
  ctx2.fillStyle="white";
  ctx2.fill();
  //create grdient 95% and 105% of original radius
  grad=ctx2.createRadialGradient(0,0,radius*.095,0,0,radius*1.05);
  //color stope of inner,middle and outer edge of circle, gives depth
  grad.addColorStop(0,'#333');
  grad.addColorStop(0.5,'white');
  grad.addColorStop(1,"#333");
  //draws clock
  ctx2.strokeStyle=grad;
  ctx2.lineWidth=radius*0.1;
  ctx2.stroke();
 //draw inner circle of clock
  ctx2.beginPath();
  ctx2.arc(0,0,radius*0.1,0,2*Math.PI);
  ctx2.fillStyle="#333";
  ctx2.fill();
}

function drawNumbers(ctx2,radius){
  var ang;
  var num;
  ctx2.font = radius*0.15 + "px arial";
  ctx2.textBaseline="middle";
  ctx2.textAlign="center";
  for(num=1;num<13;num++){
    ang=num*Math.PI /6;
    ctx2.rotate(ang);
    ctx2.translate(0,-radius*0.85);
    ctx2.rotate(-ang);
    ctx2.fillText(num.toString(),0,0);
    ctx2.rotate(ang);
    ctx2.translate(0,radius*0.85);
    ctx2.rotate(-ang);
  }

}
function drawTime(ctx2, radius){
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    //hour
    hour=hour%12;
    hour=(hour*Math.PI/6)+(minute*Math.PI/(6*60))+(second*Math.PI/(360*60));
    drawHand(ctx2, hour, radius*0.5, radius*0.07);
    //minute
    minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
    drawHand(ctx2, minute, radius*0.8, radius*0.07);
    // second
    second=(second*Math.PI/30);
    drawHand(ctx2, second, radius*0.9, radius*0.02);
}

function drawHand(ctx2, pos, length, width) {
    ctx2.beginPath();
    ctx2.lineWidth = width;
    ctx2.lineCap = "round";
    ctx2.moveTo(0,0);
    ctx2.rotate(pos);
    ctx2.lineTo(0, -length);
    ctx2.stroke();
    ctx2.rotate(-pos);
}

})
