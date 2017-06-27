$(document).ready(function(){
   var moves; /*current array of moves to make*/
   var count; /*current number of moves*/
   var movenbr; /*current move number of player*/
   sounds = {"blue":"https://s3.amazonaws.com/freecodecamp/simonSound4.mp3","red":"https://s3.amazonaws.com/freecodecamp/simonSound3.mp3","yellow":"https://s3.amazonaws.com/freecodecamp/simonSound2.mp3","green":"https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"};
  var not_failed;
  var total_moves;
  var strict=false;
  var disable = true;


  function initSimon(){

    count = 1;
    $("#counter").html(count);
    moves =[];
    movenbr=0;
    not_failed = true;
    strict=false;
    disable=true;/*not tested*/
    total_moves = 20;
  }

  $("#myonoffswitch").click(function(){
    if($("#myonoffswitch").prop("checked")){
      $(".btn").addClass("buttonon");
      $(".btn").removeClass("buttonoff");
    }
    else {$(".btn").addClass("buttonoff");
          $(".btn").removeClass("buttonon");
         }
  });

  /*clicked on the strict button*/
  $("#strict").click(function(){
    if (strict){
      strict = false;
      $("#strict").html("");
    }
    else{
      $("#strict").html("on");
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
            console.log("in here");
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
$(".btn").addClass("buttonoff");
initSimon();
});
