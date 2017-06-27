const SOLUTION = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,0]],
      HEIGHT=4,
      WIDTH=4;
var player = true, //the person is playing, false when the peeps play
    playerMoves = 0,
    peepMoves = 0;

function fillArray(width,height){
  //fills an array from 0 to width, height
  //used provide selection of tile numbers
  var choices = [];
  for (var i=0;i<width*height;i++){
    choices.push(i);
  }
  return choices;
}

function randInt(max){
  /*returns an integer, used to create random generation
    of tiles */
  return Math.floor(Math.random()*max);
}

function gameTile(){
  this.value = 0; /*number value on tile */
  this.tx = 0; /*x position for number in square */
  this.ty = 0; /*y position for number in square */
  this.x = 0;  /*x position for rectangle in svg */
  this.y = 0; /* y position for rectange in svg */
  this.rectID = ""; /*id for rectangle */
  this.textID = ""; /* id for text in retangle */
}

/*is a 4x4 which contains the tile numbers on the board
  0 represents the blank space                         */
var tileBoard = {
  solution : SOLUTION, /*used to determine in won */
  height : HEIGHT,
  width : WIDTH,
  setup: function(){
    var temp = []; /* random array of the numbers for tiles */
    var row;
    var col;
    var x = 0;
    var y = 0;
    var tx = 50;
    var ty = 60;
    this.position = [];/* holds player tiles*/
    this.initSetup =[];/*used for when peeps play */
    for (var i =0;i<this.width;i++){/*create 4 * 4 game */
      this.position.push([]);
      this.initSetup.push([]);
    };
    temp = fillArray(this.width,this.height);
    for (var i=0;i<this.width*this.height;i++){
      col = i%this.width;
      row = (i-col)/this.width;
      //picks a random position from the remaing tiles
      var pos = randInt(this.width*this.height-i);
      var newTile = new gameTile();
      newTile.value = temp[pos];
      newTile.rectID = "rectID" + newTile.value.toString();
      newTile.textID = "textID" + newTile.value.toString();
      newTile.x = x;
      newTile.y = y;
      newTile.tx = tx;
      newTile.ty = ty;
      x = x + 100;
      tx = tx + 100;
      if (x == 400) {
        x = 0;
        tx = 50;
        ty = ty + 100;
        y = y + 100;}
      this.position[row].push(newTile);
      this.initSetup[row].push(newTile);
      temp.splice(pos,1);/*removed used number */
    };
  },
  checkWin: function(){
    for (var i=0;i<this.width;i++){
      for (var j=0;j<this.height;j++){
        //if (this.position[i][j].value != this.solution[i][j]) return false;
        if (this.position[i][j].value != this.solution[i][j]) return true;
        console.log(i,j,this.position[i][j].value,this.solution[i][j]);
      }
    }
    return true;
  },
  findLocation: function(pieceNbr){
    /*finds the location of a tile (pieceNbr) on the board
      and returns the (row,col) - uses internal rep. of board                          */
    for (var i=0;i<this.width;i++){
      for (var j=0;j<this.height;j++){
        if (this.position[i][j].value == pieceNbr) {
          return {row:i,col:j}
        }
      }
    }
  },
  printBoard(){
    /*used for debugging to print out the what the board looks like */
    for (var i=0;i<this.width;i++){
        console.log(this.position[i][0].value,this.position[i][1].value,
          this.position[i][2].value,this.position[i][3].value);
    }
  },
  legalMove(tile,blank){
    //determines if the move it legal or not
    if (tile.row == blank.row){
      if (((tile.col + 1) == blank.col) || ((tile.col-1) == blank.col)) return true;
    }
    if (tile.col == blank.col){
      if (((tile.row+1) == blank.row) || ((tile.row-1) == blank.row)) return true;
    }
    return false;
  },
  move(tile,blank){
    /* need to swap the tiles around*/
    /*swap internal board values */
    var tmptile = new gameTile;
    const tmprectID = "tmprect";
    const tmptextID = "texttext";
    const tmpvalue = tileBoard.position[tile.row][tile.col].value;
    const rect = tileBoard.position[tile.row][tile.col].rectID;
    const text = tileBoard.position[tile.row][tile.col].textID;
    const blankrect = "rectID0";
    const blanktext = "textID0";
    tmptile = tileBoard.position[tile.row][tile.col];
    tileBoard.position[tile.row][tile.col] = tileBoard.position[blank.row][blank.col];
    tileBoard.position[blank.row][blank.col] = tmptile;

    /*need to swap the ids and change the tiles in html */
    $("#"+rect).prop('id',tmprectID);
    $("#"+blankrect).prop('id',rect);
    $("#"+tmprectID).prop('id',blankrect);
    $("#"+text).prop('id',tmptextID);
    $("#"+blanktext).prop('id',text);
    $("#"+tmptextID).prop('id',blanktext);
    $("#"+rect).addClass("tile").removeClass("blankTile");
    $("#"+blankrect).addClass("blankTile").removeClass("tile");
    $("#"+text).text(tileBoard.position[blank.row][blank.col].value);
    $("#"+blanktext).text(tileBoard.position[tile.row][tile.col].value);

  }
};

function createTiles(){
  /* this function clones the tiles and puts them on the board */

  var rectID = "",
      textID ="",
      oldtextID = tileBoard.position[0][0].textID,
      oldrectID = tileBoard.position[0][0].rectID,
      col=0,
      row = 0;
      /*change the tile in the html to the first tile in internal array
       then clone the rect and text for the other tiles */
      $("#rect1").prop('id',oldrectID);
      $("#text1").prop('id',oldtextID);
      oldrectID = "#" + oldrectID;
      oldtextID = "#" + oldtextID;
      $(oldtextID).text(tileBoard.position[row][col].value);
      col += 1;
  for (var i = 0;i<15;i++){
    textID = tileBoard.position[row][col].textID;
    rectID = tileBoard.position[row][col].rectID;
    $(oldtextID).clone(true).appendTo('svg').attr({
      'x':tileBoard.position[row][col].tx,
      'y':tileBoard.position[row][col].ty,
      'id':tileBoard.position[row][col].textID});
    $(oldrectID).clone(true).appendTo('svg').attr({
      'x':tileBoard.position[row][col].x,
      'y':tileBoard.position[row][col].y,
      'id':tileBoard.position[row][col].rectID});
    oldrectID = "#"+tileBoard.position[row][col].rectID;
    oldtextID = "#"+tileBoard.position[row][col].textID;
    $(oldtextID).text(tileBoard.position[row][col].value);
    col += 1;
    if (col == 4){
      col = 0;
      row += 1;
    }
  }
 //change the 0 tile to the blank tile
  $("#rectID0").addClass("blankTile").removeClass("tile");
}

function playSlidingTile(){
  /*start the game */
  tileBoard.setup(); /*creates the board and the order of tiles */
  createTiles();
}

function swap(clicked_id) {
  var tile,
      blank;
  tile = tileBoard.findLocation(parseInt(clicked_id.slice(6)));
  blank = tileBoard.findLocation(0);
  if (tileBoard.legalMove(tile,blank)){
    //increment counter
    if (player) {playerMoves += 1;
    } else {peepMoves += 1;}
    tileBoard.move(tile,blank);
    if (tileBoard.checkWin()){
      $("#myModal").modal({show:true});
      if (player) {
        $('#plMoves').text(playerMoves);
      } else {
        $("#plMoves").text(peepMoves);
      }
    }
  }
  tileBoard.printBoard();

}

/**********************************************/
/********** below start the ai for the peeps */

var alreadyFound = [];
var mymoves = 0;
function peep_play (){
  var hx;
  var board = [[],[],[],[]]

  //restore board to oirginal state
  console.log("entered peep play");
  tileBoard.position = tileBoard.initSetup;
  //remove the cloned tiles
  $('text').slice(1).remove();
  $('rect').slice(1).remove();
  createTiles();

  for (var i =0;i<4;i++){
    for (var j = 0;j<4;j++){
      board[i].push(tileBoard.position[i][j].value);
    }
  }
  /*** creating a test board *****/
  //board = [[6,13,7,10],[8,9,11,0],[15,2,12,5],[14,3,1,4]];
  board = [[13,2,10,3],[1,12,8,4],[5,0,9,6],[15,14,11,7]];
  //board = [[1,2,3,0],[5,6,8,4],[9,10,7,12],[13,14,11,15]];
  hx = cost(board,0,0);
  var blank = findrowcol(board,0);
  var init = new Node(hx,board,blank.row,blank.col,0);
  var goal = new Node(0,SOLUTION,3,3,0);
  var astar = new AStar(init,goal,0);
  var result = astar.execute();
  console.log(result.path,result.path.length);
}

function findrowcol(board,tile){
  for (var i=0;i<4;i++){
    for (var j =0;j<4;j++){
      if (board[i][j] == tile){return {row:i,col:j}}
    }
  }
}
function cost(board,depth,number){
  /*calculate the cost h(x) = g(x) + h(x) uses  manhattan distance */
  const corLoc = [
    {row:0,col:0},{row:0,col:1},{row:0,col:2},{row:0,col:3},
    {row:1,col:0},{row:1,col:1},{row:1,col:2},{row:1,col:3},
    {row:2,col:0},{row:2,col:1},{row:2,col:2},{row:2,col:3},
    {row:3,col:0},{row:3,col:1},{row:3,col:2},{row:3,col:3}
    ];
  var future = 0,
      curloc,
      ind=1,
      endloc;
  /*don't care about the blank space */
  for (var i =0;i<4;i++){
    for (var j = 0;j<4;j++){
      curloc = findrowcol(board,board[i][j]);
      if (board[i][j] != 0){
        future += manhatten(curloc,corLoc[board[i][j]-1]);
      }
      ind++;
    }
  }
  return future * 6;
}
function manhatten(curloc,goal){
    var dist = Math.abs(curloc.row - goal.row) + Math.abs(curloc.col - goal.col);
    return dist;
}

//create the priority queue

function PriorityQueue() {
  this.data = [];
}

PriorityQueue.prototype.push = function(element, priority) {
  //insert element with higher priority, lowest priority at top
  mymoves += 1;
  for (var i=0;i<this.data.length && (this.data[i][1]<priority);i++);
  this.data.splice(i,0,[element,priority]);
}

PriorityQueue.prototype.pop = function() {
  //removes element from queue
  return this.data.shift()[0];
}

PriorityQueue.prototype.size = function() {
  //return length, know when queue is empty
  return this.data.length;
}

function Node(value,state,emptyRow,emptyCol,depth){
  this.value =  value; //f(s) value g(s) + h(s) h(s) = manhatten distance
  this.state = state;  //board layout
  this.emptyCol=emptyCol;
  this.emptyRow = emptyRow;
  this.depth = depth; //number of moves to get to this point g(s)
  this.strRepresentation = "";
  this.path = "";  //DLRU lsit of moves by blank to get here
//create a string representation of the table
  for (var i =0;i<4;i++){
    for (var j=0;j<4;j++){
      this.strRepresentation += state[i][j].toString()+",";
    }
  }

  this.size = this.state.length;
}

function AStar(initial,goal,empty){
  this.initial = initial;
  this.goal = goal;
  this.empty = empty;
  this.queue = new PriorityQueue();
  this.queue.push(this.initial,this.initial.value);
  //this.visited = [];
}

AStar.prototype.execute = function(){
  //add current state to visited list
  //this.visited = {strvalue:this.initial.strRepresentation}
  //this.visited.push(this.initial.strRepresentation)
  alreadyFound.push(this.initial.strRepresentation);
  //while ((this.queue.size() >0)&&(mymoves < 25000)){
  while (this.queue.size() >0){
    var current = this.queue.pop();
    if (current.strRepresentation == this.goal.strRepresentation){
      console.log("we solved the puzzle");
      return current;
    }
    this.expandNode(current);

  }
  console.log("******** at end ******");
  console.log("queue size ",this.queue.size());
  console.log("queue ",this.queue);
}

AStar.prototype.expandNode = function (node){
  var temp = "";
  var newState = '';
  var col = node.emptyCol;
  var row = node.emptyRow;
  var newNode = '';

  // Up
  if (row > 0)
  {
     newState = node.state.clone();

     temp = newState[row - 1][col];
     newState[row - 1][col] = this.empty;
     newState[row][col] = temp;
     newNode = new Node(0, newState, row - 1, col,  node.depth + 1);
     if (!contains(newNode.strRepresentation)){
     newNode.value = newNode.depth + cost(newNode.state,0,0);
     newNode.path = node.path + "U";
     this.queue.push(newNode,newNode.value);
     alreadyFound.push(newNode.strRepresentation);
     }
  }

  // Down
  if (row < node.size - 1)
  {
     newState = node.state.clone();
     temp = newState[row + 1][col];
     newState[row + 1][col] = this.empty;
     newState[row][col] = temp;
     newNode = new Node(0, newState, row + 1, col, node.depth + 1);
     if (!contains(newNode.strRepresentation)){
        newNode.value = newNode.depth + cost(newNode.state,0,0);
        newNode.path = node.path + "D";
        this.queue.push(newNode,newNode.value);
        alreadyFound.push(newNode.strRepresentation);
     }
  }

  // Left
  if (col > 0)
  {
      newState = node.state.clone();
      temp = newState[row][col - 1];
      newState[row][col - 1] = this.empty;
      newState[row][col] = temp;
      newNode = new Node(0, newState, row, col - 1, node.depth + 1);
      if (!contains(newNode.strRepresentation)){
        newNode.value = newNode.depth + cost(newNode.state,0,0);
        newNode.path = node.path + "L";
        this.queue.push(newNode,newNode.value);
        alreadyFound.push(newNode.strRepresentation);
      }
  }

  // Right
  if (col < node.size - 1)
  {
     newState = node.state.clone();
     temp = newState[row][col + 1];
     newState[row][col + 1] = this.empty;
     newState[row][col] = temp;
     newNode = new Node(0, newState, row, col + 1, node.depth + 1);
     if (!contains(newNode.strRepresentation)){
        newNode.value = newNode.depth + cost(newNode.state,0,0);
        newNode.path = node.path + "R";
        this.queue.push(newNode,newNode.value);
        alreadyFound.push(newNode.strRepresentation);
     }
  }
}

Array.prototype.clone = function(){
  return JSON.parse(JSON.stringify(this));
}
function contains(strRepresentation){
  return alreadyFound.includes(strRepresentation);

}

AStar.prototype.heuristic = function(node){
  return this.manhattanDistance(node);
}
$(document).ready(function(){
  console.log("in the main java code");
  playSlidingTile();

  //player won so it is the peeps turn
  $("#modalBtn").on('click',function(){
    var startTime = new Date();
    peep_play();
    var endTime =  new Date();
    console.log("execution time ",(endTime - startTime));
  });


});
