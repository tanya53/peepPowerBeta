'use strict';

var appUrl = window.location.origin;
var ajaxFunctions = {
   ready: function ready (fn) {
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         return fn();
      }

      document.addEventListener('DOMContentLoaded', fn, false);
   },
   ajaxRequest: function ajaxRequest (method, url,poststring, callback) {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
           callback(xmlhttp.response);
         }
         if (xmlhttp.readyState === 4 && xmlhttp.status === 500){
           console.log("we landed here");

         }
      };
      xmlhttp.open(method, url, true);
      if (method =="POST"){
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(poststring);
      }else{
      xmlhttp.send();}
   }
};
