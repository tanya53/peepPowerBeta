$(document).ready(function(){
    sound1 = "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3";
   sound2 = "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"

    var per;
    var percent;
    var relax;
    var chore;
    var time;
    var clicked;
    var c = new clock();


    function clock(){
      this.choretime=25;
      this.resttime=25;
      this.session = chore;
      this.counter = 0;
      this.currenttime = this.choretime;
    }

    function init(){
     $("#session").text("Session");
     clicked =true;
     chore = 0;
     relax = 1;
     c.resttime = Number($("#rest_time").text());
     c.choretime = Number($("#chore_time").text());
     $("#current_time").text(minsec(c.choretime*60));
     c.current_time = c.choretime;

     c.session = chore;
     clicked = true;

    }

    $('#increase_rest').click(function() {
       if (clicked){
       c.resttime += 1;
       $("#rest_time").text(c.resttime);
       if (c.session == relax){
         c.counter = 0;
         c.currenttime = c.resttime*60;
         $("#current_time").text(minsec(c.currenttime));
         percent = (1/c.currenttime)*100;
       }
       }
        });

    $('#decrease_rest').click(function(){
      if (clicked){
        c.resttime -=1;
        if (c.resttime <1){c.resttime=1;}
        $("#rest_time").text(c.resttime);
        if (c.session == relax){
          c.counter = 0;
          c.currenttime=c.resttime *60;
          $("#current_time").text(minsec(c.currenttime));
          percent =(1/c.currenttime)*100;
        }
      }
        });

    $('#increase_chore').click(function() {
      if (clicked){
       c.choretime += 1;
       $("#chore_time").text(c.choretime);
       if (c.session == chore){
           c.counter = 0;
           c.currenttime=c.choretime *60;
           $("#current_time").text(minsec(c.currenttime));
           percent = (1/c.currenttime)*100;
       }
      }
       });

    /*modified the chore time depending on sign clicks */
    $('#decrease_chore').click(function() {
      if (clicked){
      c.choretime -=1;
      if (c.choretime <1){c.choretime =1;}
        $("#chore_time").text(c.choretime);
        if (c.session == chore){
          c.counter = 0;
          c.currenttime = c.choretime*60;
          $("#current_time").text(minsec(c.currenttime));
          percent = (1/c.currenttime)*100;
        }
      }
      });

     $('#load-bar-frame').click(function(){
       /*need to rotate between stopping and starting clock */
       if (clicked){
         clicked = false;
         if (c.session == chore){choretime();}
         else {resttime();}
       }
       else {clearInterval(time);
             clicked=true;}
     });

  function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);}

   function minsec(time){
     var minutes = Math.floor(time / 60);
     var seconds = time - minutes * 60;
     return str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
   }

   function choretime(){
     /*try using check current_time = chore_time*/
       c.session = chore
       $("#session").text("Session");
       c.currenttime = c.choretime *60;
       if (c.counter==0) {
         percent = (1/c.currenttime)*100;
         per = percent;
         c.counter = c.currenttime;
         $('#load-bar').css({background:"#b3ffff"});
       }
       time = setInterval(function () {
           --c.counter
           $("#current_time").text(minsec(c.counter));
           $('#load-bar').css({background: "linear-gradient(to top, #00ccff "+per+"%,transparent "+per+"%,transparent 100%)"});
           per = per + percent;
           if (c.counter == 0){
               clearInterval(time)
               var audio = new Audio(sound2);
               audio.play();
               resttime();
           }
           }, 1000);
    }

  function resttime(){
     $("#session").text("Break!");
     c.session = relax;
     c.currenttime = c.resttime * 60;
     if (c.counter ==0){
       percent = (1/c.currenttime)*100;
       per = percent;
       c.counter = c.currenttime;
     }
     time = setInterval(function () {
         --c.counter;
         $("#current_time").text(minsec(c.counter));
         $('#load-bar').css({background: "linear-gradient(to bottom, #00ccff "+per+"%,transparent "+per+"%,transparent 100%)"});
         per = per+percent;
         if (c.counter == 0){
             clearInterval(time)
             var audio = new Audio(sound2);
             audio.play();;
             choretime();
         }
        }, 1000);

    }

    init();
    });
