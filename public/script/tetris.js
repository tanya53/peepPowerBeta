//make sure the piece stops at the bottom and sides
// make the radom drop fro the top, always 3 in okay
// transfer piece to board, and have board display then and remove complete rows
// lose if get to top


//37 left arrow  - move left
//38 up arrow  - rotate left
//39 right arrow  - more right
//40 down arrow - rotate right

var shapes = [],
    newpiece;

const UP = 1,
      LEFT = 2,
      DOWN = 3,
      SIDE = 20,
      HEIGHT = 440,
      WIDTH = 500,
      ROWS = WIDTH/SIDE,
      COLS = HEIGHT/SIDE;


var timer1;
var timer2;

function updateTetrisBoard(){
  TetrisBoard.clear();
  newpiece.newPos();
  newpiece.speedX = 0; //left right movement
  newpiece.speedY = 0;//rotation of piece
  if (TetrisBoard.key && TetrisBoard.key ==37){
    newpiece.speedX = -1;
  }
  if (TetrisBoard.key && TetrisBoard.key == 38){
    newpiece.speedY = 1;
  }
  if (TetrisBoard.key && TetrisBoard.key == 39){
    newpiece.speedX = 1;
  }
  if (TetrisBoard.key && TetrisBoard.key == 40){
    newpiece.speedY = -1;
  }
  newpiece.update();

}
function setIntervals(){
  timer1 = setInterval(updateTetrisBoard,20);
  timer2 = setInterval(createNewPiece,4500);
}
function clearIntervals(){
  clearInterval(timer1);
  clearInterval(timer2);
}
function tetElementOnDom(type,id){
  var element=document.createElement(type);
  element.id = id;
  return element;
}
//slices of the board
function tilePiece () {
  this.height = 420;
  this.filled = false;
}
/*create the board */
var TetrisBoard = {
  canvas: tetElementOnDom("canvas","tetrisID"),
  start: function(level){
    this.canvas.width = WIDTH;
    this.canvas.height = HEIGHT;
    this.context = this.canvas.getContext("2d");
    document.getElementById("tetris").insertBefore(this.canvas,document.getElementById("tetris").childNodes[0]);
    this.level = level
    this.height = HEIGHT;
    this.tiles = new Array();
    for (var x=0;x<COLS;x++){
      this.tiles[x] = new tilePiece();
    }
    //set up the arrays that hold the board tiles
    /*for (var x = 0;x<25;x++){
      this.col[x].height=440;
      for (var y =0;y<22;y++){
        this.tile[x][y].fill = false;
      }
    };*/

    window.addEventListener('keydown',function(e){
      TetrisBoard.key = e.keyCode;
      e.preventDefault();// prevents arrow keys from working as arrow keys in canvas
    });
    window.addEventListener('keyup',function(e){
      TetrisBoard.key = false;
    });
  },
  clear: function(){
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
  }
};
function piece (){
  const COLORS = ["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#ffffff"];
  const SHAPES = ["square",
                  "line",
                  "el",
                  "es",
                  "reves",
                  "other",];
  const XPOS =  [[[-1,0,-1,0],[-1,0,-1,0],[-1,0,-1,0],[-1,0,-1,0]],//square
                 [[-.5,-.5,-.5,-.5],[-2,-1,0,1],[-.5,-.5,-.5,-.5],[-2,-1,0,1]],//line
                 [[-.5,-.5,-.5,.5],[-1.5,-.5,.5,.5],[0,0,0,-1],[.5,-.5,-1.5,-1.5]],//el
                 [[-.5,.5,-1.5,-.5],[-1,-1,0,0],[-.5,-1.5,.5,-.5],[0,0,-1,-1]],//es
                 [[-1.5,-.5,-.5,.5],[-1,-1,0,0],[.5,-.5,-.5,-1.5],[0,0,-1,-1]],//reves
                 [[-1.5,-.5,.5,-.5],[0,0,0,-1],[.5,-.5,-1.5,-.5],[-1,-1,-1,0]] //other
               ];
  const YPOS = [[[-1,-1,0,0],[-1,-1,0,0],[-1,-1,0,0],[-1,-1,0,0]], //square
               [[-2,-1,0,1],[.5,.5,.5,.5],[-2,-1,0,1],[.5,.5,.5,.5]], //line
               [[-1.5,-.5,.5,.5],[0,0,0,-1],[.5,-.5,-1.5,-1.5],[-1,-1,-1,0]],//el
               [[-1,-1,0,0],[-.5,-1.5,.5,-.5],[0,0,-1,-1],[-.5,.5,-1.5,-.5]],//es]
               [[-1,-1,0,0],[.5,-.5,-.5,-1.5],[0,0,-1,-1],[-1.5,-.5,-.5,.5]],
               [[0,0,0,-1],[.5,-.5,-1.5,-.5],[-1,-1,-1,0],[-1.5,-.5,.5,-.5]]//reves
             ];
  this.speedX = 0;
  this.speedY = 0;
  this.createPiece = function(x,y){
    this.x = x; //PIVOT POINTS
    this.y = y;
    this.pos = 0;
    this.color = COLORS[generate_random(6,0)];
    var shapenbr = generate_random(6,0);
    this.type = SHAPES[shapenbr];
    this.xpos = XPOS[shapenbr];
    this.ypos = YPOS[shapenbr];
    this.drawShape();
  },
  this.drawShape = function(){
    var x,y;
    var ctx = TetrisBoard.context;
    ctx.beginPath();
    for (var i =0;i<4;i++){
      x = this.x + SIDE*this.xpos[this.pos][i]
      y = this.y + SIDE*this.ypos[this.pos][i]
      ctx.rect(x,y,SIDE,SIDE);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    ctx.closePath();
  },
  this.newPos = function(){
    const inc = .5; //down .5 pixels a frame
    for (var i=0;i<4;i++){
      if (this.y + inc >= HEIGHT-SIDE ) {
        console.log("this y ",this.y);
        this.y = HEIGHT-SIDE;
      } else {
      this.y = this.y + inc;
    }
    }
   },
  this.update = function(){
    var tmp;
    //add in the speedX
    if (this.speedX == 1){
      for (var i=0;i<4;i++){
        this.x = this.x + 2;
      }
    }
    if (this.speedX == -1){
      for (var i=0;i<4;i++){
        this.x = this.x - 2;
      }
    }
    if (this.speedY == 1){ //should go 0 1 2 3 0
        this.pos = (this.pos+1) % 4;
    }
    if (this.speedY == -1){ //should go 3 2 1 0 3
      if (this.pos == 0) {this.pos = 3}
      else {this.pos = this.pos -1;}
    }
    this.drawShape();
  }
}

function generate_random (max,offset){
  return Math.floor((Math.random()*max)+offset);
}
function createNewPiece(){
  newpiece = new piece();
  newpiece.createPiece(100,0);
}


function startTetris(level){
  console.log("entered startTetris");
  TetrisBoard.start(level);
  TetrisBoard.canvas.tabIndex = 1;
  newpiece = new piece();
  newpiece.createPiece(100,0);
  //newpiece.drawShape();
  setIntervals();
}
function resetTetrisGame(level){
  console.log("entered resetTetrisGame")
}

$(document).ready(function(){

 $("#level1").on("click",function(){//only atomic fireballs
   if (TetrisBoard.level === undefined){startTetris(1);}
   else resetTetrisGame(1);
 });
// level 2 add user move bombs
// level 3 user bombs and random bombs

});
