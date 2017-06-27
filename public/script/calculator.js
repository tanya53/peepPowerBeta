$(document).ready(function(){
  equation = "";
  ac = 0; /* sum of current equation, can be used as input*/
  equal = false;

  /* created the equation could be put back in click
     function, here from earlier attempt at problem. */
function add(addval){
  equation = equation + addval;
  $("#equation").val(equation);
}

$("button").click(function(){
   var val = $(this).attr("value");
   if (val =="CE"){
     equation=equation.slice(0,-1)
     $("#equation").val(equation);
   }
   else if (val =="AC"){
     console.log("resetting ac");
     ac = 0;
     equation="";
     $("#equation").val("");
   }
   else if (val == "="){
    console.log("in equal");
     /*prints error msg on calc and to console. */
     try{
       var result = eval(equation);
       $("#equation").val(result);
       }
     catch(e){
       console.log("there was an error",e);
       $("#equation").val("error");
     }
    equation ="";
    ac = result;
   }
   else {
     /*want to use previous total as input*/
     if ((equation.length ==0)&&(val=="%"||val=="*"||val=="/"||val=="+"||val=="-")){
       console.log("in add ac",ac);
       add(ac.toString());
     }
     add(val);
   }
   /*don't want to see what key was pressed */
   $(this).blur();

});
});
