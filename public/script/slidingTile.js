const SOLUTION = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,0]],
      HEIGHT=4,
      WIDTH=4;
var player = true, //the person is playing, false when the peeps play
    playerMoves = 0,
    peepMoves = 0,
    peepPlays = "",
    reset = false;
    peepsPlaying = false,
    complete = false;

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
    if (!peepsPlaying) {this.initSetup = []}
    //this.initSetup =[];/*used for when peeps play */
    for (var i =0;i<this.width;i++){/*create 4 * 4 game */
      this.position.push([]);
      //this.initSetup.push([]);
    };
    temp = this.validBoard();
    if (peepsPlaying){
      temp = this.initSetup;
    }
    for (var i=0;i<this.width*this.height;i++){
      col = i%this.width;
      row = (i-col)/this.width;
      var newTile = new gameTile();
      newTile.value = temp[i];
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
      //this.initSetup[row].push(newTile);
      this.initSetup.push(newTile.value);
    };
  },
  solveable: function(temp){
    var parity = 0;
    var gridWidth = WIDTH;
    var row = 0;
    var blankRow = 0;
    for (var i =0;i <temp.length;i++){
      if (i % gridWidth ==0) { //next row
        row++;
      }
      if (temp[i] == 0) { //found blank tile
        blankRow = row;
        //continue;
      }
      for (var j= i+1; j<temp.length;j++){
        if (temp[i] > temp[j] && temp[j] != 0){
          parity++
        }
      }
    }
    if (blankRow % 2 == 0) { //blank odd row, count from bottom
      return parity % 2 == 0;
    } else { //blank on even row from bottom
      return parity % 2 != 0;
    }

  },
  validBoard : function(){
    /* only about 50% of the random boards are solveable, make sure board is workable */
    var valid = false;
    var board;
    var choices;
    while (!valid){
      temp = [];
      board = [];
      temp = fillArray(this.width,this.height);
      for (var i =0; i < WIDTH * WIDTH;i++){
      var pos = randInt(this.width*this.height-i);
      board.push(temp[pos]);/*removed used number */
      temp.splice(pos,1);
      }
      valid = this.solveable(board);
    }
    return board;
  },
  checkWin: function(){
    for (var i=0;i<this.width;i++){
      for (var j=0;j<this.height;j++){
        if (this.position[i][j].value != this.solution[i][j]) return false;
        //if (this.position[i][j].value != this.solution[i][j]) return true;
      }
    }
    return true;
  },
  findLocation: function(pieceNbr){
    /*finds the location of a tile (pieceNbr) on the board
      and returns the (row,col) - uses internal rep. of board
     */
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
       if (peepsPlaying || reset){
         $("text").slice(1).remove();
         $("rect").slice(1).remove();
         $("text").prop("id","text1");
         $("rect").prop("id","rect1");
         oldvalue = tileBoard.position[0][0].value;
         $("text").text(oldvalue);
       }

      $("#rect1").prop('id',oldrectID);
      $("#text1").prop('id',oldtextID);
      oldrectID = "#" + oldrectID;
      oldtextID = "#" + oldtextID;
      oldvalue = tileBoard.position[0][0].value;

      $(oldtextID).text(tileBoard.position[row][col].value);
      //remove the cloned tiles to restore board

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
function dumpBoard (board){
  var outstr = "";
  for (var i = 0;i<HEIGHT * WIDTH;i++){
      outstr = outstr + board[i].toString()+','
  }
  return outstr;
}
function playSlidingTile(){
  /*start the game */
  tileBoard.setup(); /*creates the board and the order of tiles */
  queryString = dumpBoard(tileBoard.initSetup);
  peepMoves = 0;
  playerMoves = 0;

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
      if (player) {
        console.log("we are here");
        $("#modal-title1").text("Congratulations you finished!");
        $("#modalTextSlide").html("It took you <span id = plMoves></span> moves.  The peeps are up next, let's see if they will beat you.  They are pretty good when they mind meld together, which can give them an unfair advantage, but also can lead to some heated discussion overthe best move.")
        $('#plMoves').text(playerMoves);
      } else {
        console.log("we are in else");
        $("#modal-title1").text("The Peeps Finished!");
        $("#modalTextSlide").html('It took the peeps <span id = plMoves></span> moves. Thanks for playing!')
        $('#plMoves').text(peepMoves);
        //$("#plMoves").text(peepMoves);
      }
    $("#myModal").modal({show:true});
    }
  }
  //tileBoard.printBoard();

}
function peepMove(i){
  //decides which way the blank is moving and then the tile that is swapped with it
  var blankLoc = tileBoard.findLocation(0);
  var swapValue;

    if (peepPlays[i] =="U"){
      swapValue = tileBoard.position[blankLoc.row-1][blankLoc.col].value;
      swap("rectID"+swapValue.toString());

    } else if (peepPlays[i] == "D") {
      swapValue = tileBoard.position[blankLoc.row+1][blankLoc.col].value;
      swap("rectID"+swapValue.toString());
    } else if (peepPlays[i] == "L") {
      swapValue = tileBoard.position[blankLoc.row][blankLoc.col-1].value;
      swap("rectID"+swapValue.toString());
    } else {
      swapValue = tileBoard.position[blankLoc.row][blankLoc.col+1].value;
      swap("rectID"+swapValue.toString());
    }
}
function delayMoves(pos){ //need a delay so see the individual moves
  setTimeout(function(){
    peepMove(pos);
    pos++;
    if (pos < peepPlays.length){
      delayMoves(pos);
    }
  },1500);
}

function peep_play(){

  peepsPlaying = true;
  player=false;
  //set board back to initial state
  tileBoard.setup();
  createTiles();
  delayMoves(0);
}

$(document).ready(function(){
  playSlidingTile();

  //player won so it is the peeps turn
  $("#modalBtn").on('click',function(){

    var apiUrl = window.location.origin + '/sliding?board='+ queryString;
    if (player){
      reset = false;
      $("#startPeep").modal({show:true});
      ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, "",function (data) {
          peepPlays = data;
          //closeModal();
          $("#startPeep").modal("hide");
          peep_play();
         }));
    } else {
      peepsPlaying = false;
      player = true;
      reset = true;
      playSlidingTile();
    }
  });


});
