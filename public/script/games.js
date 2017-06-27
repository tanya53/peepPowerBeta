/* memeory card game, deck from a sprite sheet */
var matchingGame = {};
var pairs_found = 0;




function shuffle(){
  return 0.5 - Math.random();
}

function selectCard(){
  /*flip over the cards, make sure card exists (no removed, opaque)*/
  var x;
  //trying to flip a removed card
  if ($(this).hasClass("card-removed"))return;
  //two cards alread flipped
  if ($(".card-flipped").length > 1){
    return;
  }
  $(this).addClass("card-flipped");
  //check the pattern of bloth flipped card 0.7s later
  /*delay so player can see the cards */
  if ($(".card-flipped").length ===2){
    setTimeout(checkPattern,1500);
  }

}

function checkPattern(){
  /* counting pairs to know when the game ends*/
  /*when pair is found change to opaue and marked as removed */
  if (isMatchPattern()){
    pairs_found += 1;
    $(".card-flipped").removeClass("card-flipped").addClass("card-removed");
    if (pairs_found == 19) {document.getElementById("playagain").style.display = "block";
    }

  } else {
    $(".card-flipped").removeClass("card-flipped");
  }
}

/*check if the cards match, returns boolean */
function isMatchPattern(){
  var cards = $(".card-flipped");
  var pattern = $(cards[0]).data("pattern");
  var anotherPattern = $(cards[1]).data("pattern");
  return (pattern === anotherPattern);
}
/* initialize the card deck, and the faces */
function initgame(){
  pairs_found = 0;
  matchingGame.deck = [
    'cardAndre','cardAndre',
    'cardBuffy','cardBuffy',
    'cardDraco','cardDraco',
    'cardGeorge','cardGeorge',
    'cardGertrude','cardGertrude',
    'cardHillary','cardHillary',
    'cardIsabella','cardIsabella',
    'cardKonrad','cardKonrad',
    'cardLaLa','cardLaLa',
    'cardLauence','cardLauence',
    'cardLeo','cardLeo',
    'cardMartha','cardMartha',
    'cardOliver','cardOliver',
    'cardPatti','cardPatti',
    'cardPeter','cardPeter',
    'cardPetunia','cardPetunia',
    'cardPrudence','cardPrudence',
    'cardSergio','cardSergio',
    'cardTig','cardTig',
  ];
  matchingGame.deck.sort(shuffle);
  //clone 12 copies of the card, there are 38 cards
  for (var i=0; i<37; i++){
    $(".card:first-child").clone().appendTo("#game");
  }
  //initialze each card's position
  $("#game").children().each(function(index){
    //card are in one long row and flexbox takes care of wrapping them
    //the -50 and -100 were putting them in the top left corner, otherwise there was an offset
    var x = ($(this).width() + -50);
    var y = ($(this).height() + -100);
    $(this).css("transform","translateX(" + x +"px) translateY(" +y+"px)");
    //get a pattern from the shuffled deck
    var pattern = matchingGame.deck.pop();
    //visually apply the pattern on the card's back side.
    $(this).find(".back").addClass(pattern);

    //embed the pattern data into the DOM element
    $(this).attr("data-pattern",pattern);

    //listen the click event on each card DIV element
    $(this).click(selectCard);
  });
}

//number of faces to start with
var numberOfFaces = 2;

/***** find the extra peep game *****/
function generateFaces(){
  var theLeftSide = document.getElementById("leftside");
   var theRightSide = document.getElementById("rightside");
  for (i = 0; i<numberOfFaces;i++){
    var img = document.createElement("img");
    var top = Math.floor(Math.random()*400);
    var left = Math.floor(Math.random()*400);
    top=top.toString() + "px";
    left=left.toString() + "px";
    img.setAttribute('src','../images/bear.png');
    img.setAttribute('position','absolute');
    img.setAttribute("class",'bearpng');
    theLeftSide.appendChild(img);
    theLeftSide.lastChild.style.top= top;
    theLeftSide.lastChild.style.left= left;
  }
  // need to clone images to the right side
  var the_clone=theLeftSide.cloneNode(true);
  the_clone.removeChild(the_clone.lastChild);
  theRightSide.appendChild(the_clone);

  //increase the number of faces and start over, passed level
  theLeftSide.lastChild.onclick=function nextLevel(event){
    event.stopPropagation();
    numberOfFaces += 2;
    while(theLeftSide.firstChild)
      theLeftSide.removeChild(theLeftSide.firstChild);
    while(theRightSide.firstChild)
      theRightSide.removeChild(theRightSide.firstChild);
    generateFaces();
    };

   //incorrect answer
   var gameArea = document.getElementById("gameArea");
   gameArea.onclick = function gameOver(){
     var theLeftSide = document.getElementById("leftside");
     var theRightSide = document.getElementById("rightside");
     while(theLeftSide.firstChild){
       theLeftSide.removeChild(theLeftSide.firstChild);
       }
     while(theRightSide.firstChild){
       theRightSide.removeChild(theRightSide.firstChild);
     }
     alert("Game Over!");
     gameArea.onclick=null;
     numberOfFaces = 2;

     }
   }

$(document).ready(function(){
  console.log('we executed this code');
  $("#gamebtn").on('click',function(){
    //need to reset if hit play while playing
    $("#leftside").empty();
    $("#rightside").empty();
    numberOfFaces = 2;
    generateFaces();
  });

  //************* memory game ***************/
  /*matchgame code and button */
  initgame();
  /*if want to play matchgame again, remove the clones to make a new game */
  $("#yesbtn").on('click',function(evt) {
     document.getElementById("playagain").style.display = "none";
     var game = document.getElementById("game");
     while (game.firstChild) {
         game.removeChild(game.firstChild);
     }
    $('#game').append('<div class="card"><div class="face front"></div><div class="face back"></div></div>')
    initgame();
  });
  $("#nobtn").on('click',function(evt) {
    $("#playagain").append("<div>Thanks for playing, see you later</div>");
  });

  /************** Simon js *****************/
  var moves; /*current array of moves to make*/
  var count; /*current number of moves*/
  var movenbr; /*current move number of player*/
  sounds = {"blue":"https://s3.amazonaws.com/freecodecamp/simonSound4.mp3","red":"https://s3.amazonaws.com/freecodecamp/simonSound3.mp3","yellow":"https://s3.amazonaws.com/freecodecamp/simonSound2.mp3","green":"https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"};
 var not_failed;
 var total_moves;
 var strict=false;

 function initSimon(){

   count = 1;
   $("#counter").html(count);
   moves =[];
   movenbr=0;
   not_failed = true;
   //strict=false;
   disable=true;/*not tested*/
   total_moves = 20;
 }

 $("#myonoffswitch").click(function(){
   if($("#myonoffswitch").prop("checked")){
     $("#strict").removeClass("disabled");
     $("#start").removeClass("disabled");
     $("#strict").prop("disabled",false);
     $("#start").prop("disabled",false);

   }
   else {
         $("#strict").addClass("disabled");
         $("#start").addClass("disabled");
         $("#strict").prop("disabled",true);
         $("#start").prop("disabled",true);
        }
 });

 /*clicked on the strict button*/
 $("#strict").click(function(){
   if (strict){
     strict = false;
   }
   else{
     strict = true;
   }
 });

 $("#start").click(function (){
   /*initiate the variables */
   initSimon();
   generateMoves(true);
  });/*start function*/

 function lightarea(move){
   /* lights up the color area of move and plays the audio */
   var divarea = '#'+move;
   $(divarea).addClass('lit');
   var audio = new Audio(sounds[move]);
   audio.play();
   window.setTimeout(function(){
     $(divarea).removeClass("lit");},300);
   }

 function playgame(){
   var i = 0;
   var int =600;
   disable = true;
   /*increase the speed of the game */
   if (movenbr > 5){
     if(movenbr >12){
       int=200;
     }
     else {int = 400;}
   }
   var interval = setInterval(function(){
     lightarea(moves[i]);
     i++
     if (i >= moves.length){
       clearInterval(interval);
       disable = false;
     }
   },int)
 }

 function generateMoves(addone){
   /*adds the new color to array if true
     if false replays without adding newone*/
   if (addone){
   var color = generatenbr();
   moves.push(color);}
   playgame()
   return;
 }

 function generatenbr(){
 /*generate random number to pick color*/
   var colors = ["green","red","yellow","blue"];
   var pos = Math.floor(Math.random() * 4);
   return colors[pos];
 }
$(".color").click(function(){
  if (!disable){
    lightarea($(this).attr("value"));
    if ($(this).attr("value") == moves[movenbr]){
      movenbr ++;
      /*add a new move*/
      if (movenbr > (total_moves-1)){
        /*game over */
        disable = true;
        $("#win").css("visibility","visible");
        /* lights up the color area of move and plays the audio */
        var i = 0;
        moves =["red","yellow","green","blue","red","yellow","green","blue"];
        var interval = setInterval(function(){
           lightarea(moves[i]);
           i++
           if (i >= moves.length){
             clearInterval(interval);
             $("#win").css("visibility","hidden");
              initSimon();
           }
        },400);
      }
      else if (movenbr == count){
        count++;
        $("#counter").html(count);
        lock_user=true;
        generateMoves(true);
        movenbr = 0;
      }
    }
    else {
      /*blink due to error*/
      $("#counter").html("!!");
      for (var i =0;i<3;i++){
      $("#counter").fadeOut(100);
      $("#counter").fadeIn(100);
       }
      /*replay the previous moves*/
      $("#counter").fadeIn(100,function(){
        if (!strict){
          $("#counter").html(count);
          movenbr=0;
          generateMoves(false);
        }
        else{
          movenbr=0;
          count=1;
          moves=[];
          $("#counter").html(count);
          generateMoves(true);
        }
      });
    }
  }
 });

initSimon();

/************* Tic-Tac-Toe *********************/
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
