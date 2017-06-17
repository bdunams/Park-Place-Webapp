// Initialize Firebase
// Nick's Firebase DB
var config = {
  apiKey: "AIzaSyDWDRxPYpZijnzqD2U5xSJaSwn69Ki-sfg",
  authDomain: "park-place-ca2a7.firebaseapp.com",
  databaseURL: "https://park-place-ca2a7.firebaseio.com",
  projectId: "park-place-ca2a7",
  storageBucket: "park-place-ca2a7.appspot.com",
  messagingSenderId: "29054600010"
};

firebase.initializeApp(config);

window.onload = function () {
    userPage.getLocation();
    userPage.initMap();
  $(".post-button").on("click", userPage.postLocation) 

};


var database = firebase.database(); 

    
//referencing the database once to get the values we need to append. 
 database.ref("/users").once('value', function(snapshot){
      var user = firebase.auth().currentUser;
      var userId = user.uid;

//appending new table elements for "posts"
      var posts = $('<div class="panel-heading">');
      var postsHeading = $('<h4>').text("Your Posts");
          postsHeading.appendTo(posts);
      var newTable = $('#new-data');
          posts.appendTo(newTable);

//referencing the database for posts and then executing a .forEach loop 
//in order to get the values inside each post.  
      var query = firebase.database().ref("/posts").orderByKey();
      query.once("value")
          .then(function(snap) {
            var numEntries = 0;
                snap.forEach(function(childSnap) {
                  //limiting number of results to ten.
                  if (numEntries > 9) {
                      return;
                  }
                  //checking to make sure the values were posted by this user.
                  else if (childSnap.val().postedBy === userId) {
                    console.log("worked")
                      numEntries++;
                      var latitude = childSnap.val().latitude;
                      var longitude = childSnap.val().longitude;
                      var latLng = new google.maps.LatLng(coords[1],coords[0]);
                      var marker = new google.maps.Marker({
                          position: latLng,
                          map: map
                  });
                  //appending new table elements for each of the last ten posts.
                      var newTableRow = $('<tr>')  
                      var newlocation = $('<td>').text(childSnap.val().location).appendTo(newTableRow); 
                      var newPrice = $('<td>').text(childSnap.val().price).appendTo(newTableRow);
                      var newDate = $('<td>').text(childSnap.val().dateAdded).appendTo(newTableRow);
                      var newTime = $('<td>').text(childSnap.val().timeAdded).appendTo(newTableRow); 
                      newTableRow.appendTo($('#new-data'));
                  }
                });
          });
      
      //process is repeated here for events, where 'posts'
      //is replaced by 'events' in the heading, the reference folder has changed to get "events", 
      //and values queried are a bit different. 
     
      var events = $('<div class="panel-heading events">')
      var eventsHeading = $('<h4>').text("Your Events");
          eventsHeading.appendTo(posts);
          events.appendTo(newTable);
      var query = firebase.database().ref("/users/" + userId +"/events").orderByKey();
      query.once("value")
          .then(function(snap) {
            var numEntries = 0;
            snap.forEach(function(childSnap) {
              if (numEntries > 9) {
                return;
              }
              else {
                  numEntries++;
                  var newTableRow = $('<tr>')  
                  var newlocation = $('<td>').text(childSnap.val().location).appendTo(newTableRow); 
                  var newDate = $('<td>').text(childSnap.val().date).appendTo(newTableRow); 
                  var newComments = $('<td>').text(childSnap.val().comments).appendTo(newTableRow); 
                  newTableRow.appendTo($('#new-data'));
              }
            });
          }); 
  }); 


//takes the inputs from the "post space" modal and uploads them to firebase.
//along with the date added and the time added from moment.js.  
 


var myLat;
var myLong; 
var userPageMap;

var userPage = {
    
    initMap: function() {
        UserPageMap = new google.maps.Map(document.getElementById('map'), {
          zoom: 2,
          center: new google.maps.LatLng(2.8,-187.3),
          mapTypeId: 'terrain'
        });
      },

    getLocation: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(userPage.showPosition);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    },

    showPosition: function (position) {
        myLat = position.coords.latitude 
        myLong = position.coords.longitude;
    },

    postLocation : function() {
        var price = $(".price").val();  
        var numSpots = $(".numSpots").val();
        var comments = $(".comments").val();

        database.ref("/posts").push({
          latitude: myLat,
          longitude: myLong,
          price: price, 
          numSpots: numSpots, 
          comments: comments,
          dateAdded: firebase.database.ServerValue.TIMESTAMP,
          timeAdded: moment().format('LT'),
        });
        $('.alert').html("<p>You Posted!</p>");
        setTimeout(userPage.removeAlert(), 1000);
    },

    removeAlert : function () {
        $('.alert').html("");

    },
  }