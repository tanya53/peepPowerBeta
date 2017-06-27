const SOLUTION = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,0]]
var alreadyFound = [];
var mymoves = 0;
function peep_play (initboard){
  var hx;
  var board = [[],[],[],[]]
  var pos =0;
  var passedBoard;
  alreadyFound = [];
  mymoves =0;
  passedBoard = initboard.split(",");
  for (var i =0;i<4;i++){
    for (var j = 0;j<4;j++){
      board[i].push(parseInt(passedBoard[pos]));
      pos++;
    }
  }

  hx = cost(board,0,0);
  var blank = findrowcol(board,0);
  var init = new Node(hx,board,blank.row,blank.col,0);
  var goal = new Node(0,SOLUTION,3,3,0);
  var astar = new AStar(init,goal,0);
  var result = astar.execute();
  return result.path;
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

//create the priority queue, this should have been method in AStar, fix

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
      return current;
    }
    this.expandNode(current);

  }
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

module.exports = {peep_play};
