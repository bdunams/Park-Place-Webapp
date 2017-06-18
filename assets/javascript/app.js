// GOOGLE MAPS API CODE

// Initialize Firebase
// Brians Firebase DB
var config = {
  apiKey: "AIzaSyAst2LMBiU-oQ7YPuGZK4MEYi0gwOTB4Ag",
  authDomain: "parking-app-170123.firebaseapp.com",
  databaseURL: "https://parking-app-170123.firebaseio.com",
  projectId: "parking-app-170123",
  storageBucket: "parking-app-170123.appspot.com",
  messagingSenderId: "137520573980"
};

firebase.initializeApp(config);

var database = firebase.database();

// global variables
var map;
var lat, lng;

// function to add markers to the map
function addMarkerToMap(lat, lng, infoWindowHtml,symbol){
  
  var infowindow = new google.maps.InfoWindow({
    content: infoWindowHtml,
    maxWidth: 400
  }); 
  var myLatLng = new google.maps.LatLng(lat, lng); 
  if(symbol === 'parking'){
    var marker = new google.maps.Marker({ 
    position: myLatLng,
    icon: 'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png',
    map: map, 
    animation: google.maps.Animation.DROP, 
    })
  }
  else{
    var marker = new google.maps.Marker({ 
    position: myLatLng,
    icon:'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png',
    map: map, 
    animation: google.maps.Animation.DROP, 
    })
  }
  
  marker.addListener('click', function(){
    infowindow.open(map, marker); 
  })
      
}

// function to initialize the map,
function initMap() {
  
  // search result GET variable from url
  var address = window.location.search.substr(10);
  geocoder = new google.maps.Geocoder();
  
  // used to turn your location entered into precise coordinates
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == 'OK') {
      map.setCenter(results[0].geometry.location);
      //we call the functions inside the results object in order to get the lat and long.
      lat = results[0].geometry.location.lat();
      lng = results[0].geometry.location.lng();
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
    } else {
      // geocode failed to find position
    }
  });

  // creates the map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: new google.maps.LatLng(41.4995344,-81.6944326),
    mapTypeId: 'roadmap'
  });
}

// update map with all posts from Firebase
database.ref('Posts').on('child_added', function(snap){

// each child/post in database
var currentPost = snap.val();
  
// content for each Info Window
var contentString = 
    '<div><h2>Parking Available</h2><p class="lead">'
    + currentPost.comment +'</p>'
    + '<p>Posted by '+currentPost.postedBy+' at '+currentPost.timestamp+'</p> <p><strong>Price: </strong>'
    + currentPost.price +' <strong>Spots Available:</strong> '
    + currentPost.spotsLeft +'</p></div>';

//Add each location to the map along with markers
addMarkerToMap(currentPost.location[0],currentPost.location[1],contentString,'parking');

})

//-------------------------------------------------------------
// EVENTFUL API CODE
  
// GET search input from previous page
$(document).ready(function() {
  // initiallize map on document readyness
  initMap()
  
  $("#form").on("submit", function(event) {
      event.preventDefault();
      $("#eventInfo").empty();
      if ($(this).parsley().isValid()) {
          displayEvent();
          $(".form-control").val('');
          
      }
  });
});


// function to get and display Eventful API results
function displayEvent() {

  // gets location GET variable from url
  if(window.location.search){
    var location = window.location.search.substr(10);
    location = location.replace("+", " ");
  }
  else{
    // default location set to Cleveland
    location = 'Cleveland'
  }
  
  // Available additional search criteria
  //var keyword = $("#keyword").val().trim();
  //var event = $("#event").val().trim();

  // Eventful API Search Arguments
  var oArgs = {

      app_key: "N78vd3fpJCDPZCB7",

      //q: event,

      where: location,

      date: "This Week",
    
      within: '8',

      //category: keyword,

      page_size: 8,

      sort_order: "relevance",

  };

  // Eventful API Call
  EVDB.API.call("/events/search", oArgs, function(oData) {

      // Note: this relies on the custom toString() methods below
      Object.prototype.toString = function() {
          var s = "{\n";
          for (var x in this) {
              s += "\t" + x + ": " + this[x].toString() + "\n";
          }
          s += "}";
          return s;
      }
      var results = oData.events.event;
      // loop through Eventful API search results
      for (var i = 0; i < results.length; i++) {
          var lat = results[i].latitude;
          var lng = results[i].longitude;
          var title = results[i].title;
          var time = results[i].start_time;
          var venue = results[i].venue_name;
          var city = results[i].city_name;
          var state = results[i].region_abbr;
          var address = results[i].venue_address;
          var url = results[i].url;
          var description;
          var image;
          // if no image is returned, use default image
          if (results[i].image !== null) {
              image = results[i].image.medium.url;
          } else {
              image = "assets/images/event.png";
          };
          if (results[i].description !== null) {
              description = results[i].description;
          } else {
              description = "Not Provided";
          }
        
          // Eventful Search Results panel format for html
          var eventsDiv = '<div class="panel panel-default"><div class="panel-body">'+
              '<h4>'+title+'</h4>'+
              '<div class="image"><img src="'+image+'"></div>'+
              '<div class="description">'+description+'</div>'+
              '<div class="venue">'+venue+'</div>'+
              '<div class="address">'+address+'</div>'+
              '<div class="cityState">City/State: ' +city+ ', ' +state+'</div>'+
              '<div class="time">Time: '+time+'</div>'+
              '<div class="url"><a href="'+url+'" target="_blank">Tickets</a></div>'+
              '</div></div>';
        
          // Eventful Search Results format for map marker infowindow
          var eventsInfo = '<h4>'+title+'</h4>'+
              '<div class="image"><img src="'+image+'"></div>'+
              '<div class="description">'+description+'</div><br>'+
              '<div class="venue">'+venue+'</div>'+
              '<div class="address">'+address+'</div>'+
              '<div class="cityState">City/State: ' +city+ ', ' +state+'</div>'+
              '<div class="time">Time: '+time+'</div>'+
              '<div class="url"><a href="'+url+'" target="_blank">Tickets</a></div>';
        
          // add event markers
          addMarkerToMap(lat,lng,eventsInfo);

          // append Eventful panels to html
          $("#events").append(eventsDiv);
        
          // show more/show less plug-in feature from jquery.collapser.js
          $(".description").collapser({
              mode: 'words',
              truncate: 20
          });
      }
  });
}
displayEvent();
