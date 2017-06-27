var board = [1,2,3,4,6,7,8,9,13,14,15,0,10,11,12,13];
const correct = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0]
function position(){
  return pos >= 5;
}
function cost (board,depth,number){
  var future = 0;
  var index;
  for (var sq=0;sq<16;sq++){
    occupant = board[sq];
    if (occupant != 0) {
      shouldbe = correct.indexOf(occupant);
      future += manhatten(sq,shouldbe);
    }
  }
  past = depth;
  return past + future *3; //see if want to change the 3
}
manTable = [];
function manhatten(a,b){
  if (manTable.length == 0){
    for (var i =0;i<16;i++){
      manTable.push([]);
    }
    console.log("building table for manhatten");
    for (var aa =0;aa <16;aa++){
      for (var bb =0;bb <16;bb++){
          arow = parseInt(aa/4);
          acol =aa%4;
          brow = parseInt(bb/4);
          bcol=bb%4;
          manTable[aa].push(Math.abs(arow-brow)+Math.abs(acol - bcol));
      }
    }
  }
  ans = manTable[a][b];
  console.log(manTable);
  return ans;
}

cost(board,0,0);
