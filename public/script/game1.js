/* The player tries to run int othe tumblers, every time a tumbler is height
 the radius of the player is reduced, when the radius gets to one the player goes to the
 next level.  The game stops when the player hits a nuppe.  There are four levels, a
 random number of items made up of a random number of nuppe and tumblers.  The four levels
 are top only, top + left, top+left+bottom, and then all four sides.
 */


 /* to do :
 1. remove arrow keys as scroll in site one
 2. add modal for collision
 3. start game with modal
 4. limit array size, now grows forever, only need 16?
 5. fix colors, background image or gradient
 6. look at adding acceleration option
 */
var player;
var player2;
var objects=[];
var gamestop = false;
var next_level = false;
var $msgModal = $('#myModal').modal();
function updateGameArea(){
  if (player.crashWith()) { /* there was a crash */
    player.stop();
      gamestop = true;
    if (next_level) { /*level ended */
      clearInterval(myGameArea.interval);
      clearInterval(myGameArea.interval2);
      myGameArea.clear();
      objects.length = 0;

      $("#myModal").modal('show')
      if (myGameArea.level == 4){
        $(".modal-body").html('<p>You won!! Play again?</p>');
      } else
        $(".modal-body").html("<p>Congratulations, next level</p>");
      }

      /*gamestop = false;
      next_level = false;
      if (myGameArea.level == 4){myGameArea.level =0;
      } else {myGameArea.level += 1;}
      startGame(myGameArea.level);*/

  } else {
    myGameArea.clear();
    player.newPos();
    if (myGameArea.keys && myGameArea.keys[37]) {player.speedX = -1;}
    if (myGameArea.keys && myGameArea.keys[39]) {player.speedX = 1;}
    if (myGameArea.keys && myGameArea.keys[38]) {player.speedY = -1;}
    if (myGameArea.keys && myGameArea.keys[40]) {player.speedY = 1;}
    player.update();
    for (var i = 0;i<objects.length;i++){
      objects[i].x = objects[i].x + objects[i].plusx;
      objects[i].y = objects[i].y + objects[i].plusy;
      objects[i].update();
    }
  }
}
var myGameArea = { /* canvas */
  canvas: document.createElement("canvas"),
  start: function(level) {
    this.canvas.width=600;
    this.canvas.height= 500;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas,document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea,20); /*timer to update canvas */
    this.interval2 = setInterval(add_objects,3000); /*adds new objects to canvas */
    this.level = level;
    window.addEventListener('keydown',function(e) {
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = true;
    });
    window.addEventListener('keyup',function(e) {
      myGameArea.keys[e.keyCode] = false;
    });
  },
  clear: function(){
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
  }

}
/* player */
function component(x,y,radius,color,piece_type,plusx,plusy){
  this.x = x;
  this.y = y;
  this.plusx = plusx; //use by the different levels
  this.plusy = plusy;
  this.radius = radius;
  this.color = color;
  this.piece_type = piece_type; /* player, nuppe, or tuple */
  ctx=myGameArea.context;
  ctx.beginPath(); /*draw item on screen */
  ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
  ctx.fillStyle=this.color;
  ctx.fill();
  ctx.closePath();
  this.speedX = 0;
  this.speedY = 0;
  this.update = function(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.fillStyle=this.color;
    ctx.fill();
    ctx.closePath();
  }
  this.newPos = function() { /* the player wraps on the screen */
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0) {this.x = ctx.canvas.width;}
    if (this.x > ctx.canvas.width) {this.x = 0;}
    if (this.y < 0) {this.y = ctx.canvas.height;}
    if (this.y > ctx.canvas.height) {this.y = 0}
  },
  this.stop =  function () { /*stops the game */
    clearInterval(myGameArea.interval);
    clearInterval(myGameArea.interval2);
  },
  this.crashWith = function(){ /*tests is there was a crash */
    var crash = false;
    for (var i=0;i<objects.length;i++){
      var rsum = (player.radius + objects[i].radius);
      var xsum = Math.pow((player.x - objects[i].x),2);
      var ysum = Math.pow((player.y - objects[i].y),2);

      if (Math.sqrt((xsum+ysum)) < rsum){ /* get tumbler, shring radius */
        //if collide with tumber reduce radius of player and keep playing
        if (objects[i].piece_type =="T"){
          player.radius = player.radius -1; /* tumber disappears once hit */
          objects[i].radius = 0;
          if (player.radius <= 0){ /* won the level */
            next_level = true;
            crash = true;
          }
        } else {
            crash = true;
        }
      }
    }
  return crash;
  }
}

function add_objects (){ /* add random number of new objects */
  var x;
  var y =0;
  var level;
  var color = "";
  var radius;
  var piece_type="";
  LEVELS = [[1,0,0,1],[0,1,1,0],[1,1,0,-1],[1,1,-1,0]];
  if (!gamestop){
    nbr_objects = Math.floor((Math.random()*10)+1);
    for (var i=0;i<nbr_objects;i++){
      x= Math.floor((Math.random()*580)+20);
      y= Math.floor((Math.random()*480)+20);
      level = Math.floor(Math.random() * myGameArea.level);
      if (Math.random() > .8) {
        /* these are nuppe */
        color="green";
        piece_type = "N"; //will stop game
        radius = Math.floor((Math.random()*20)+2);
      } else {
        /*this are tumblers */
        piece_type = "T"; //will reduce radius of player
        color = "blue";
        radius = 8;
      }
      x = x * LEVELS[level][0];
      y = y * LEVELS[level][1];
      if (level == 3){x = myGameArea.canvas.width;} /* from the right side */
      if (level == 2) {y = myGameArea.canvas.height;} /* from the bottom */
      objects.push(new component(x,y,radius,color,
                   piece_type,LEVELS[level][2],LEVELS[level][3]));

    }
  }
}



function startGame(level){
  myGameArea.start(level);
  player = new component (300,250,20,"red","P",0,0);
  add_objects();

}

$(document).ready(function(){
  startGame(1);
  $('#myModal').on('hidden.bs.modal',function(e){
    console.log("we are in the calback");
    gamestop = false;
    next_level = false;
    if (myGameArea.level == 4){myGameArea.level =0;
    } else {myGameArea.level += 1;}
    startGame(myGameArea.level);
  });
});
