

      function initMap() {
        var myLatLng = {lat: -25.363,lng:131.044}
        var place, sign1, sign2

        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 1,
          center: {lat: -28.024, lng: 140.887},

        });
        //for (peepmarker in locations) {
        //  location = (peepmarker.lat,peepmarker.lng);


        for (var i=0;i<locations.length;i++){
          sign1 = 1;
          sign2 = 1;

          if (Math.random() > .5) {sign1 = -1}
          if (Math.random() > .5) {sign2 = -1}
          place = {lat: Math.random() * 83*sign1,lng:Math.random()*180*sign2}
          var marker = new google.maps.Marker({
            position:place,
            map:map,
            title:locations[i].title,
            icon:locations[i].icon
          });
        }
      }

      var locations = [
        {title:"Tig",icon:'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'},
        {title:"Oliver",icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},
        {title:"Buffy",icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png'},
        {title:"Prudence",icon:'http://maps.google.com/mapfiles/ms/icons/green-dot.png'},
        {title:"Patti",icon:'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'},
        {title:"Petunia",icon:'http://maps.google.com/mapfiles/ms/icons/green-dot.png'},
        {title:"Hillary",icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png'},
        {title:"Martha",icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},
        {title:"LaLa",icon:'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'},
        {title:"Prince Sergio",icon:'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'},
        {title:"Princess Isabella",icon:'http://maps.google.com/mapfiles/ms/icons/green-dot.png'},
        {title:"Andre",icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png'},
        {title:"Konrad",icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},
        {title:"Peter",icon:'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'},
        {title:"George",icon:'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'},
        {title:"Laruence",icon:'http://maps.google.com/mapfiles/ms/icons/green-dot.png'},
        {title:"Leo",icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png'},
        {title:"Draco",icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},
        {title:"Gertrude",icon:'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'},
      ];
