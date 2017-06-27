$(document).ready(function(){
  /*the first move is random by the computer, the minimax algortihm was
    used to play smart (i hope ) */
  var choices /*free space on the board */
  var winning /*the winning rows, cols and diag. 1d array */
  var me, you /*players */
  var EMPTY /* current 'F' unused square */
  var board /*current board */
  var winner /*used to check for tie and win*/
  var scores /*used by minimax*/
  var first;

  /* initialize the global variables
     and set the divs that are hidden */
  function initTicTacToe(){
    choices = ["0","1","2","3","4","5","6","7","8"];
    winning = [[0,1,2,"row1"],[3,4,5,"row2"],[6,7,8,"row3"],[0,3,6,"vert1"],[1,4,7,"vert2"],[2,5,8,"vert3"],[0,4,8,"diag1"],[2,4,6,"diag2"]];
    me="";
    you="";
    EMPTY = "F"
    winner=0;
    board = ["F","F","F","F","F","F","F","F","F"];
    scores = [];
    moveCount = 0;
    first = true;

    $('hr').removeClass();
    $('.lines').hide();
    $('.winner').hide();
    $('.yesno').hide();
    $('.gamestart').hide().fadeIn('fast');

  }

  /*screen at start to let you pick x or o */
  $(".play").click(function(){
    you =$(this).attr("value");
    if (you =="X"){me = "O";}
    else (me = "X");
    $('.gamestart').fadeOut('slow');
    mymove();
  });

   /* asks if you want to play again*/
   $(".yesno").click(function(){
   if ($(this).attr("value")=="Yes"){
     for (var mypos=0;mypos<9;mypos++){
       var outstr = "#" + mypos.toString();
       $(outstr).html("&nbsp;");
      }
      initTicTacToe();
   }
   else {$(".winner").html("Have a Good Day!")
         $(".box").off("click");};
 });

  function mymove(){
    /* first move is random */
    if (first){
      mypos = getpos();
      first = false;
    }
    else {
      var newboard = board.slice(0);
      mypos = getaimove(newboard);
      pos = choices.indexOf(mypos.toString());
      choices.splice(pos,1);
    }
    var outstr = "#" + mypos;
    board[mypos] = me;
    $(outstr).html(me);
    outstr = "#box"+mypos;
    checkwinner();
  }

  /* move by the player */
  $(".box").click(function(){
    box = $(this).attr("value");
    var outstr = "#" + box;
    pos = choices.indexOf(box);
    if (pos != -1){
      board[box] = you
      choices.splice(pos,1);
      $(outstr).html(you);
      checkwinner();
      if (winner==0){
      mymove();}}
  });

  /* generates random move for first play, this was set up because
  for the first pass all the computer moves were random */
  function getpos(){
    var min = 0;
    var max = choices.length;
    var pos = Math.floor(Math.random() * (max-min))+min;
    var boardpos = choices[pos]
    choices.splice(pos,1);
    return boardpos;

  }

  /* checks to see who won or id a draw */
  function checkwinner(){
    winner = 0;
    for (check = 0; check < winning.length;check++){
      a = winning[check][0];
      b = winning[check][1];
      c = winning[check][2];
      if ((board[a] == board[b]) &&
         (board[b] == board[c]) &&
         (board[a] != EMPTY)){
           winner = board[a];
           $("hr").removeClass();
           $("hr").addClass(winning[check][3]);
           $('.lines').hide().fadeIn('fast');


           if (winner == me){$('.winner2').html('I won !Play again?');}
          else {$('.winner2').html('Congratulations! You   Won Play again?');}
                     $('.winner').hide().fadeIn(3000);
           $('.yesno').hide().fadeIn('fast');
    }

       }
       if ((choices.length==0) && (winner ==0)){
         $('hr').removeClass();
         $('.winner').hide().fadeIn(1000);
         $('.yesno').hide().fadeIn('slow');
         $('.winner2').html('It was a draw Play again?');
       }
  }

/* ai section added after the above was working the game always starts with the computer making a random move, the minimax algorithm is used to pick the best move for the computer to make */

function getaimove(board){
  temp_score_move_temp = getMaxMove(board,me);
  move_t = temp_score_move_temp[1];
  board[move_t] = me;
  console.log("leave getaimove ",move_t);
  return move_t;
}

function initBoard(){
  var board = [];
  board = [0,0,0,0,0,0,0,0];
  return board;
}
/* get a list of the free moves on the board */
function getMoveList(board){
  var move_list = [];
  for (var x =0;x<9;x++){
    if (board[x] =="F"){
      move_list.push(x);
    }
  }
return move_list;
}

/* flip the current player betweein X and O */
function flip(mark) {
  if (mark =="X")
    return 'O';
  return 'X';
}

/*rotates recursively between getmaxmove and getminmove until the game is a
  draw or win, checks all the moves for the board */
/* max is the computer and the min is the human player */
function getMaxMove(board,mark){
  var move_list = getMoveList(board);
  var win_move = null;
  var move_score = -1;
  for (var i=0;i<move_list.length;i++){
    var move = move_list[i];
    var copy_board = board.slice(0);
    copy_board[move] = mark;
    var done = aiCheckWin(copy_board,mark,move_list.length);
    if (done == "won"){
      move_score =1;
      win_move = move;
      break;
     }
    if (done=="draw"){
      score=0;
    }
    else {
      score=getMinMove(copy_board,flip(mark));
    }
    if (score>move_score){
    move_score=score;
    win_move=move;
  }
}
return [move_score,win_move];
}

function getMinMove(board,mark){
  var move_list = getMoveList(board);
  var move_score = 1;
  var score;
  for (var i=0;i<move_list.length;i++){
    var move=move_list[i];
    var copy_board=board.slice(0);
    copy_board[move] = mark;
    done = aiCheckWin(copy_board,mark,move_list.length);
    if(done == "won"){
      move_score= -1;
      win_move=move;
      break;
    }

    if (done=="draw"){
      score=0;
    }
    else{
      var temp_score_move_temp = getMaxMove(copy_board,flip(mark));
      score=temp_score_move_temp[0];
    }
    if (score <move_score){
      move_score = score;
    }
  }
  return move_score;
}

/* this is largely a copy of the above checkwin function, but the ai was added after the program worked so I added it again with some modifications */
function aiCheckWin(newboard,mark,len){
  var win=0;
  for (check =0; check<winning.length;check++){
    a = winning[check][0];
    b = winning[check][1];
    c = winning[check][2];
    if ((newboard[a] == newboard[b]) && (newboard[b]==newboard[c]) && (newboard[a] != EMPTY)){
      return "won";
    }
  }
  if ((len ==0) && (win=0)){
    return "draw";
  }
  return "I";
}

initTicTacToe();
});
