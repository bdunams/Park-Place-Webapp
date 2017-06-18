// Initialize Firebase
// Brians Firebase DB
//var config = {
//  apiKey: "AIzaSyAst2LMBiU-oQ7YPuGZK4MEYi0gwOTB4Ag",
//  authDomain: "parking-app-170123.firebaseapp.com",
//  databaseURL: "https://parking-app-170123.firebaseio.com",
//  projectId: "parking-app-170123",
//  storageBucket: "parking-app-170123.appspot.com",
//  messagingSenderId: "137520573980"
//};
//
//firebase.initializeApp(config);

// Configured in Login.js file
var database = firebase.database();

var myLat;
var myLong; 
var userPageMap;

var userPage = {
    
//    initMap: function() {
//        UserPageMap = new google.maps.Map(document.getElementById('map'), {
//          zoom: 2,
//          center: new google.maps.LatLng(2.8,-187.3),
//          mapTypeId: 'terrain'
//        });
//      },

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
      console.log('post attempt');
      
        var price = $("#price").val();  
        var numSpots = $("#numSpots").val();
        var comments = $("#comments").val();

        database.ref("Posts").push({
          location:[myLat,myLong],
          postedBy: currentUser.uid,
          price: price, 
          spotsLeft: numSpots, 
          comment: comments,
          dateAdded: firebase.database.ServerValue.TIMESTAMP,
          timestamp: moment().format('ddd MMM Do, hh:mm a'),
        },function(){
          $('.alert').html("<p>Post failed too be uploaded</p>");
        });
        $('.alert').html("<p>You Posted!</p>");
        setTimeout(userPage.removeAlert, 1000);
    },

    removeAlert : function () {
        $('.alert').html("");

    },
  }

//window.onload = function () {
    
//    userPage.initMap();
  $("#post-button").on("click", userPage.postLocation) 
  $("#modal-button").on("click", userPage.getLocation) 

//};
  
  
// update map with all posts from Firebase
database.ref('Posts').on('child_added', function(snap){

  // each child/post in database
  var currentPost = snap.val();
    console.log(currentPost);
  
  if(currentPost.postedBy === currentUser.uid){
    // content for each Info Window
    var contentString = 
        '<div><h2>Parking Available</h2><p class="lead">'
        + currentPost.comment +'</p>'
        + '<p>Posted by '+currentPost.postedBy+' at '+currentPost.timestamp+'</p> <p><strong>Price: </strong>'
        + currentPost.price +' <strong>Spots Available:</strong> '
        + currentPost.spotsLeft +'</p></div>';
    
    $('#userposts').append(contentString);
  }

  

  //Add each loaction to the map along with markers
  //addMarkerToMap(currentPost.location[0],currentPost.location[1],contentString,'parking');

})

    
//referencing the database once to get the values we need to append. 
// database.ref("/users").once('value', function(snapshot){
//      var user = firebase.auth().currentUser;
//      var userId = user.uid;
//
////appending new table elements for "posts"
//      var posts = $('<div class="panel-heading">');
//      var postsHeading = $('<h4>').text("Your Posts");
//          postsHeading.appendTo(posts);
//      var newTable = $('#new-data');
//          posts.appendTo(newTable);

//referencing the database for posts and then executing a .forEach loop 
//in order to get the values inside each post.  
//      var query = firebase.database().ref("/posts").orderByKey();
//      query.once("value")
//          .then(function(snap) {
//            var numEntries = 0;
//                snap.forEach(function(childSnap) {
//                  //limiting number of results to ten.
//                  if (numEntries > 9) {
//                      return;
//                  }
//                  //checking to make sure the values were posted by this user.
//                  else if (childSnap.val().postedBy === userId) {
//                    console.log("worked")
//                      numEntries++;
//                      var latitude = childSnap.val().latitude;
//                      var longitude = childSnap.val().longitude;
//                      var latLng = new google.maps.LatLng(coords[1],coords[0]);
//                      var marker = new google.maps.Marker({
//                          position: latLng,
//                          map: map
//                      });
//                  }
//                });
//          });
      
      //process is repeated here for events, where 'posts'
      //is replaced by 'events' in the heading, the reference folder has changed to get "events", 
      //and values queried are a bit different. 
     
//      var events = $('<div class="panel-heading events">')
//      var eventsHeading = $('<h4>').text("Your Events");
//          eventsHeading.appendTo(posts);
//          events.appendTo(newTable);
//      var query = firebase.database().ref("/users/" + userId +"/events").orderByKey();
//      query.once("value")
//          .then(function(snap) {
//            var numEntries = 0;
//            snap.forEach(function(childSnap) {
//              if (numEntries > 9) {
//                return;
//              }
//              else {
//                  numEntries++;
//                  var newTableRow = $('<tr>')  
//                  var newlocation = $('<td>').text(childSnap.val().location).appendTo(newTableRow); 
//                  var newDate = $('<td>').text(childSnap.val().date).appendTo(newTableRow); 
//                  var newComments = $('<td>').text(childSnap.val().comments).appendTo(newTableRow); 
//                  newTableRow.appendTo($('#new-data'));
//              }
//            });
//          }); 
//  }); 


//takes the inputs from the "post space" modal and uploads them to firebase.
//along with the date added and the time added from moment.js.  
 


