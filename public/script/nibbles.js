/* can't automatcially restart game with multiple canvases on the page, will work with
one canvas on the page
*/

var snake;
var fireballs = [];
var mywalls;


const UP = 1,
      LEFT = 2,
      DOWN = 3,
      SIDE = 20,
      HEAD = "blue",
      BODY = "green",
      RIGHT = 4;
      PEST = "#ce0ebe"
function updateNibblesArea(){
  NibblesBoard.clear();
  snake.newPos();
  snake.speedX = 0;
  snake.speedY = 0;
  if ( NibblesBoard.key && NibblesBoard.key == 37) {
    if (snake.lastKey != 39) {
      snake.speedX = -1;
      snake.lastKey = 37;
    }
  }
  if (NibblesBoard.key && NibblesBoard.key == 39) {
    if (snake.lastKey !=37){
      snake.speedX = 1;
      snake.lastKey = 39;
    }
  }
  if (NibblesBoard.key && NibblesBoard.key == 38) {
    if (snake.lastKey != 40){
      snake.speedY = -1;
      snake.lastKey = 38
    }
  }
  if (NibblesBoard.key && NibblesBoard.key == 40) {
    if (snake.lastKey != 38){
      snake.speedY = 1;
      snake.lastKey = 40;
    }
  }
  snake.eat()
  snake.update();
  for (var i = 0;i<fireballs.length;i++){
    fireballs[i].redraw();
  }
  if (NibblesBoard.level > 1) { //add the walls for level 2 and 3
    mywalls.drawWalls();
  }
  if (NibblesBoard.level == 3){//pests
    pests.movePests();
    pests.drawPests();
  }
}
var timer1;
var timer2;
function setIntervals(){
  timer1 = setInterval(updateNibblesArea,20);
  timer2 = setInterval(add_fireballs,2000);
}
function clearIntervals(){
  clearInterval(timer1);
  clearInterval(timer2);
}
function nibElementOnDom(type,id){
  var element=document.createElement(type);
  element.id = id;
  return element;
}

/*create the board */
var NibblesBoard = {
  canvas: nibElementOnDom("canvas","nibblerID"),
  start: function(level){
    this.canvas.width = 600;
    this.canvas.height = 500;
    this.context = this.canvas.getContext("2d");
    document.getElementById("nibbler").insertBefore(this.canvas,document.getElementById("nibbler").childNodes[0]);
    this.level = level;
    window.addEventListener('keydown',function(e){
      NibblesBoard.key = e.keyCode;
      e.preventDefault();
    });
    window.addEventListener('keyup',function(e){
      NibblesBoard.key = false;
    });
  },
  clear: function(){
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
  }
}

function bodyPart(x,y){
  this.x = x;
  this.y = y;
  var ctx = NibblesBoard.context;
  ctx.beginPath();
  ctx.rect(this.x,this.y,SIDE,SIDE);
  ctx.fillStyle = BODY;
  ctx.fill;
  ctx.closePath();
}

function snakeComponent (){
  this.speedX = 0;
  this.speedY = 0;
  this.segments=[];
  this.lastKey = 0;
  this.createhead = function(x,y){
    this.segments.push(new bodyPart(x,y));
    var ctx = NibblesBoard.context;
    ctx.beginPath();
    ctx.rect(this.segments[0].x,this.segments[0].y,SIDE,SIDE);
    ctx.fillStyle = HEAD;
    ctx.fill();
    ctx.closePath();
}
  this.update = function(){
    //update segments
    var ctx = NibblesBoard.context;
    for (var i =0;i<this.segments.length;i++){
      ctx.beginPath();
      ctx.rect(this.segments[i].x,this.segments[i].y,SIDE,SIDE);
      if (i ==0){ctx.fillStyle = HEAD;}
      else {ctx.fillStyle = BODY};
      ctx.fill();
      ctx.closePath();
    }
  },
  this.raninto = function(){
    var x = this.segments[0].x;
    var y = this.segments[0].y;
    for (var i =1;i<this.segments.length;i++){
      if ((x == this.segments[i].x) && (this.segments[i].y == y))
      { return true;
      }
    }
    return false;
  },
  this.hitWall = function(){
    var headX = this.segments[0].x;
    var headY = this.segments[0].y;
    for (var i = 0;i<mywalls.walls.length;i++){
      if ((headX + SIDE > mywalls.walls[i].x) &&
          (headX < mywalls.walls[i].x + mywalls.walls[i].width) &&
          ( headY + SIDE > mywalls.walls[i].y) &&
          ( headY < mywalls.walls[i].y + mywalls.walls[i].height)){
            return true;
          }

    }
    return false;
  },
  this.hitPest = function(){
    var headX = this.segments[0].x,
        headY = this.segments[0].y,
        pestX = pests.pests[0].x,
        pestY = pests.pests[0].y;
    if (((pestX + SIDE/2)> headX) && (pestX < (headX + SIDE)) &&
       ((pestY < headY + SIDE)) && ((pestY + SIDE/2) > headY)){
          return true;
          }
    return false;
  },
  this.newPos = function(){
    var x,y;

    x = this.segments[0].x;
    y = this.segments[0].y;

    //if ran into wall you loose
    var ctx = NibblesBoard.context;
    if ((x < 0) || (x > ctx.canvas.width- SIDE) ||
        (y < 0) || (y > ctx.canvas.height- SIDE)){
        clearIntervals();
        $('#passedout').text("the edge");
        $("#NibblesModal").modal({show:true,backdrop:true});
        resetNibblesGame(NibblesBoard.level);

      } else if (this.raninto()){//check if ran into itself
        $('#passedout').text("into yourself.");
        clearIntervals();
        $("#NibblesModal").modal({show:true,backdrop:true});
        resetNibblesGame(NibblesBoard.level);

      }else if ((NibblesBoard.level > 1) && (this.hitWall())){
        clearIntervals();
        $('#passedout').text("a wall.");
        $("#NibblesModal").modal({show:true,backdrop:true});
        resetNibblesGame(NibblesBoard.level);

      }else if ((NibblesBoard.level > 2) && (this.hitPest())){
        clearIntervals();
        $('#passedout').text("a purple pest");
        $("#NibblesModal").modal({show:true,backdrop:true});
        resetNibblesGame(NibblesBoard.level);

      }

      //pop off tail and add to front
      if ((this.speedX != 0) || (this.speedY !=0)){
        if (this.speedX == 1){x = x + 20;}
        if (this.speedX == -1) {x = x - 20;}
        if (this.speedY == 1){y = y + 20;}
        if (this.speedY == -1){y = y - 20;}
        this.segments.pop();
        //add to front
        if (this.segments.length ==0) {
            this.segments.push(new bodyPart(x,y));
        }
        else {
          this.segments.unshift(new bodyPart(x,y));
        }
      }
  },

  this.eat = function(){
    /*collision test from http://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle */
    function collision(fireball,snake){
      var distX = Math.abs(fireball.x - snake.segments[0].x-SIDE/2);
      var distY = Math.abs(fireball.y - snake.segments[0].y-SIDE/2);
      if (distX > (SIDE/2 + fireball.radius)){return false;}
      if (distY > (SIDE/2 + fireball.radius)){return false;}
      if (distX <= (SIDE/2)){return true}
      if (distY <= (SIDE/2)){return true}

      var dx = distX-SIDE/2;
      var dy = distY-SIDE/2;
      return (dx*dx+dy*dy <= (fireball.radius*fireball.radius));
    }
    var eaten = false;
    var i = 0;
    while (!eaten && i < fireballs.length){
      eaten = collision(fireballs[i],this);
      i++
    }
    if (eaten && (this.speedX !=0 || this.speedY !=0)) {
      fireballs.splice(i-1,1);
      var len = this.segments.length;
        //adding square to the end
        x = this.segments[len-1].x;
        y = this.segments[len-1].y;
        if (this.speedX == 1){x = x - SIDE;}
        if (this.speedX == -1){x = x + SIDE;}
        if (this.speedY == 1) {y = y - SIDE;}
        if (this.speedY == -1) {y = y + SIDE;}
        this.segments.push(new bodyPart(x,y));
      }
    }
}
function fireballComponent(x,y,radius,color){
  this.x = x;
  this.y = y;
  this.radius= radius;
  this.color = color;
  var ctx = NibblesBoard.context;
  ctx.beginPath();
  ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
  ctx.fillStyle= this.color;
  ctx.fill();
  ctx.closePath();
  this.redraw = function(){
  ctx = NibblesBoard.context;
  ctx.beginPath();
  ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
  ctx.fillStyle = this.color;
  ctx.fill();
  ctx.closePath();
}
}
/*fireballs*/
function add_fireballs(){//limit the number of fireballs to eight on the screen max
  const color = "red",
        MAXFIREBALLS = 8;
  var x,
      y,
      radius;
  if (fireballs.length <= MAXFIREBALLS) {
    //generate random x,y and radius
    x = Math.floor((Math.random()*580)+20);
    y = Math.floor((Math.random()*480)+20);
    radius = Math.floor((Math.random()*20)+2);
    fireballs.push(new fireballComponent(x,y,radius,color));
  }
}
function pest (){//set up as array if decide to add more pests

  this.pests = [];
  this.addPest = function(){//pest always starts in upper left corner
    this.pests.push({x:0,y:0,width:SIDE/2,height:SIDE/2});
    this.drawPests();
  },
  this.drawPests = function(){
    if (NibblesBoard.level == 3){ //only add for level 3
      for (var i =0;i<this.pests.length;i++){
        var ctx = NibblesBoard.context;
        ctx.beginPath();
        ctx.rect(this.pests[i].x,
                 this.pests[i].y,
                 this.pests[i].width,
                 this.pests[i].height);
        ctx.fillStyle = PEST;
        ctx.fill();
        ctx.closePath();
      }
    }
  },
  this.movePests = function(){
    //move closer to the head of the snake
    if (this.pests[0].x > snake.segments[0].x){this.pests[0].x = this.pests[0].x - 1;
    }else {this.pests[0].x = this.pests[0].x + 1;}
    if (this.pests[0].y > snake.segments[0].y){this.pests[0].y = this.pests[0].y - 1;
    } else {this.pests[0].y = this.pests[0].y +1;}

  }
}
function generate_random (max,offset){
  return Math.floor((Math.random()*max)+offset);
}

function walls (){
  this.walls = [];
  this.addWalls = function(){

    const WALLCOLOR = "black",
          WIDTH = 10,
          HEIGHT = 100;
    var x,
        y,
        width,
        height;

    if (NibblesBoard.level > 1) {//add walls for level two and three
       //make sure a wall doesn't start on the snake, only adjuw x
        x = generate_random(270,20);
        y = generate_random(240,20);
        this.walls.push({x:x,y:y,width:WIDTH,height:HEIGHT});
        x = generate_random(270,315);
        y = generate_random(240,20);
        this.walls.push({x:x,y:y,width:WIDTH,height:HEIGHT});
        x = generate_random(270,20);
        y = generate_random(240,220);
        this.walls.push({x:x,y:y,width:WIDTH,height:HEIGHT});
        x = generate_random(270,315);
        y = generate_random(240,220);
        this.walls.push({x:x,y:y,width:WIDTH,height:HEIGHT});
        this.drawWalls();
    }
  },

  this.drawWalls = function(){
    const WALLCOLOR = "black";
    var ctx;
    if (NibblesBoard.level > 1) {//add walls for level two and three
      for (var i =0;i < this.walls.length;i++){
        var ctx = NibblesBoard.context;
        ctx.beginPath();
        ctx.rect(this.walls[i].x,
                 this.walls[i].y,
                 this.walls[i].width,
                 this.walls[i].height);
        ctx.fillStyle = WALLCOLOR;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
function startNibbles(level){
  NibblesBoard.start(level);
  NibblesBoard.canvas.tabIndex = 1;
  mywalls = new walls();
  mywalls.addWalls();
  pests = new pest();
  pests.addPest();
  snake = new snakeComponent ();
  snake.createhead(300,250);
  setIntervals();
}
function resetNibblesGame(level){
  NibblesBoard.level = level;
  snake.segments.splice(1,snake.segments.length-1);
  snake.segments[0].x = 300;
  snake.segments[0].y = 250;
  snake.speedX = 0;
  snake.speedY = 0;
  fireballs = [];
  snake.lastKey = 0;
  pests.pests[0].x = 0;
  pests.pests[0].y = 0;
  mywalls.walls = [];

  if (NibblesBoard.level >1){
    mywalls.addWalls();
  }
}

$(document).ready(function(){

 $("#level1").on("click",function(){//only atomic fireballs
   if (NibblesBoard.level === undefined){startNibbles(1);}
   else resetNibblesGame(1);
 });

 $("#level2").on("click",function(){//atomic fireballs and walls
   if (NibblesBoard.level === undefined){startNibbles(2);}
   else resetNibblesGame(2);
 });
 $("#level3").on('click',function(){//atomic fireballs, wall, and purple pests
   if (NibblesBoard.level === undefined){startNibbles(3);}
   else resetNibblesGame(3);
 });
 $("#NibblesModal").on('hide.bs.modal',function(e){
   setIntervals();

 });

});
