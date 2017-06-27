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

$(function(){
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
});
