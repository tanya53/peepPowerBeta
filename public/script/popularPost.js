
 function createPosts(data){
  //convert input to json
  var posts = JSON.parse(data);
  for (var i=0;i<posts.length;i++){
    var id = "post" + parseInt(i);
    var rcdid = posts[i]._id;
    var logentry = "<div><p>"+posts[i].date+"</p><h1>"+posts[i].title+"</h1><div id = "+id+"><p>"+posts[i].entry+
          "</p><button id = 'update"+parseInt(i)+"' onclick = 'likedpost("+i+","+-1+")' type='button' class='btn btn-default btn-sm' data-id = "+posts[i]._id+">"+
          "<span class='glyphicon glyphicon-thumbs-up'></span></button><span id ='btn"+ i.toString()+"'>"+posts[i].likes+"</span></div></div>";
    $(".posts").append(logentry);
    for (var j=0;j<posts[i].comments.length;j++){
        var commententry ="<div><p>"+posts[i].comments[j].date+"</p><p>"+posts[i].comments[j].comment+"</p><p>"+
                            posts[i].comments[j].author+"</p>"+"<p><button onclick = 'likedpost("+i+","+j+")' type='button' class='btn btn-default btn-sm'><span class='glyphicon glyphicon-thumbs-up'></span></button>"
                            +"<span id = 'cmt"+i.toString()+j.toString()+"'>"+posts[i].comments[j].like+"</span></p></div>";
        var idtag = "#"+id;
        $(idtag).append(commententry);
    }
    var btnid = id;
    var formid = "form"+i.toString();
    var blogid = id;
    var k = posts[i].comments.length;
    var cmtbox = "<form id = '"+formid+"'>Name:<input  type ='text' id= 'author"+ i.toString()+k.toString()+"' value =''><textarea id='cmtbox"+i.toString()+k.toString()+"' rows="+5+" data-id = "+posts[i]._id+" data-comments ="+posts[i].comments.length+" ></textarea>"+
          "<input type='button' onclick='getComment("+i+","+k+")' value='Add Comment' /><br><p id='comment'></p></form>"
    blogid = "#"+blogid;
    $(blogid).append(cmtbox);
  }
}

function getComment(postnbr,cmtnbr){
  var cmtid = '#cmtbox'+postnbr.toString()+cmtnbr.toString();
  var autid = '#author'+postnbr.toString()+cmtnbr.toString();
  var text = $(cmtid).val();
  var author = $(autid).val();
  //add the comment to the database, this could be a put, but using a post
  var apiUrl = window.location.origin + '/popposts/comment/';
  var rec_nbr = $(cmtid).attr("data-id");
  var nbrComments = parseInt($(cmtid).attr("data-comments")) + 1;
  poststring = "id="+rec_nbr+"&nbr="+nbrComments+"&author="+author+"&comment='"+text+"'";

  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST',apiUrl,poststring,function(data){
    //post the sanitized code from the slidingServer
    //if user not logged in redirect to the login page
    console.log("data",data);
    var output = JSON.parse(data);
    if ((output.loggedin =="true")){
      var commententry ="<div><p>today</p><p>"+output.comment+"</p><p>"+
                        output.author+"</p></div>";
      var addhere = "#post"+postnbr.toString();
      var formid = "#form"+postnbr.toString();
      $(formid).remove();
      $(addhere).append(commententry);
    } else {
      console.log("user is not logged in");
      window.location = window.location.origin + '/tempindex';
    }
  }));

}

function likedpost(postid,commentid) {
  var idnbr;
  if (commentid == -1) {//liked the article not comment
    idnbr = '#btn' + postid.toString();

  } else { //liked one of the comments
    idnbr = '#cmt' + postid.toString() + commentid.toString();
  }
    var nbr = parseInt($(idnbr).text()) + 1;
  $(idnbr).text(nbr); //update value on page
  //get record number to update
  var rec_nbr = $('#update'+parseInt(postid)).attr("data-id");
  var apiUrl = window.location.origin + '/popposts/';
  poststring = "id="+rec_nbr+"&likes="+commentid;
  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST',apiUrl,poststring,function(data){
    console.log("back from the ajax call");
  }));
}

$(document).ready(function(){
  var apiUrl = window.location.origin + '/popposts';
  //need to get the logs
  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET',apiUrl,"",function(data){
    createPosts(data);
  }));
});
