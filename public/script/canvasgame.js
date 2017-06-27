  var myGamePiece;
  var myObstacles = [];
  var myScore;

  function startGame(){
    //myGamePiece = new component(10,10,"rgba(0,0,255,0.5)",10,120);
    myGamePiece= new component(30,30,"images/bear.png",10,120,"image");
    myScore = new component("30px","Consolas","black",280,40,"text");
    myGameArea.start();
  }

  function component(width,height,color,x,y,type){
    this.type = type;
    if (type=="image") {
      this.image = new Image();
      this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function(){
      ctx = myGameArea.context;
      if (type == "image"){
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@",type,this.image,this.x,this.y,this.width,this.height);
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
      }
      else if (type == "text"){
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x,this.y,this.width,this.height);
      }
    }
    this.newPos = function(){
      this.x += this.speedX;
      this.y += this.speedY;
    }
    this.crashWith = function(otherobj){
      var myleft = this.x;
      var myright = this.x + (this.width);
      var mytop = this.y;
      var mybottom = this.y + (this.height);
      var otherleft = otherobj.x;
      var otherright = otherobj.x + (otherobj.width);
      var othertop = otherobj.y;
      var otherbottom = otherobj.y + (otherobj.height);
      var crash = true;
      if ((mybottom < othertop) || (mytop > otherbottom)||
          (myright < otherleft) || (myleft >otherright)){
          crash = false;
        }
      return crash;
    }
  }

  var myGameArea = {
      canvas : document.createElement("canvas"),
      start : function() {
          this.canvas.width = 480;
          this.canvas.height = 270;
          this.canvas.style.cursor = "none"; //hide original cursor
          this.context = this.canvas.getContext("2d");
          document.body.insertBefore(this.canvas, document.body.childNodes[0]);
          this.frameNo = 0;
          this.interval = setInterval(updateGameArea, 20);
        /* for the arrow keys
          window.addEventListener('keydown', function (e) {
              myGameArea.keys = (myGameArea.keys || []);
              myGameArea.keys[e.keyCode] = (e.type == "keydown");
          })
          window.addEventListener('keyup', function (e) {
              myGameArea.keys[e.keyCode] = (e.type == "keydown");
          })*/
          window.addEventListener('mousemove',function(e){
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
          })
          /* for touchscreen
          window.addEventLister('touchmove',function(e){
            myGameArea.x = e.touches[0].screenX;
            myGameArea.y = e.touches[0].screenY;
        })*/
      },
      clear : function(){
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      },
      stop: function(){
        clearInterval(this.interval);
      }
  }

  /* adds a new object for every given n */
  function everyinterval(n) {
    if ((myGameArea.frameNo /n) %1 ==0) {return true;}
    return false;
  }

  function updateGameArea(){
    /* for arrow keys
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -1;}
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX =1;}
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -1}
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 1;}
    myGamePiece.newPos();
    */
    /* touchscreen
    if (myGameArea.touchX && myGamesArea.touchY){
      myGamePiece.x = myGameArea.x;
      myGamePiece.y = myGameArea.y;
    }
    */
    var x, y,gap,minHeight,maxHeight,mingap,maxGap;
    for (i = 0;i < myObstacles.length; i +=1){
      if (myGamePiece.crashWith(myObstacles[i])){
        myGameArea.stop();
        return;
      }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo ==1 || everyinterval(150)){
      x = myGameArea.canvas.width;
      minHeight = 20;
      maxHeight=200;
      height = Math.floor(Math.random()*(maxHeight - minHeight+1)+minHeight);
      minGap = 50;
      maxGap = 200;
      gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
      myObstacles.push(new component(10,height,"green",x,0,"junk"));
      myObstacles.push(new component(10,x-height-gap,"green",x,height+gap,"junk"));
    }
    for (i=0; i< myObstacles.length; i += 1){
      //myObstacles[i].x += -1;
      myObstacles[i].speedX = -1;
      myObstacles[i].newPos();
      myObstacles[i].update();
    }
      if (myGameArea.x && myGameArea.y) {
        myGamePiece.x = myGameArea.x;
        myGamePiece.y = myGameArea.y;
      myGamePiece.update();
    }
    myScore.text="Score: "+myGameArea.frameNo;
    myScore.update();
  }
/*below for the buttons */
  function moveup() {
    myGamePiece.speedY = -1;
  }
  function movedown() {
    myGamePiece.speedY = 1;
  }
  function moveleft() {
    myGamePiece.speedX = 1;
  }
  function moveright() {
    myGamePiece.speedX = 1;
  }
  function stopMove(){
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
  }
