// Configured in Login.js file
var database = firebase.database();

// current variables
var myLat;
var myLong; 
var userPageMap;

// userPage object with map initialization and post submittal
var userPage = {
    // initialize user page map
    initMap: function() {
        UserPageMap = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: new google.maps.LatLng(41.4993,-81.6944),
          mapTypeId: 'terrain'
        });
      },
    // checks if browser supports geolocation, if so ask for current location
    getLocation: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(userPage.showPosition);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    },
    // get current position
    showPosition: function (position) {
        myLat = position.coords.latitude 
        myLong = position.coords.longitude;
    },
    // get post info from form and and push to database
    postLocation : function() {
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
        setTimeout(userPage.removeAlert, 1000);
        
        var location = new google.maps.LatLng(myLat,myLong);
        userPageMap.panTo(location);
    },
    // code to remove notification
    removeAlert : function () {
      $('.alert').html("");
    }
  }
// when page is fully loaded
window.onload = function () {
  userPage.initMap();
  $("#post-button").on("click", userPage.postLocation); 
  $("#modal-button").on("click", userPage.getLocation); 
};
  
// user state observer 
firebase.auth().onAuthStateChanged(function(user) {
  if (user){
    // User is signed in.
    // update current user info
    currentUser = user;
  } 
  else{
    // User is signed out.
    // possible signout actions
    // empty user information
    currentUser = {};
  }
})
  
  
// update user page with all posts from Firebase
database.ref('Posts').on('child_added', function(snap){

  // each child/post in database
  var currentPost = snap.val();
  
  // if a post author exists and if a current user exists 
  if(currentPost.postedBy && currentUser.uid){
    // shows the posts that only the current user has posted
    if(currentPost.postedBy === currentUser.uid){
      // content for each post
      var contentString = '<div class="panel panel-default"><div class="panel-body">'
          +'<div><h2>Post</h2><p class="lead">'
          + currentPost.comment +'</p><p><strong>Price: '
          + currentPost.price +'  </strong><strong>Spots Available:</strong> '
          + currentPost.spotsLeft +'</p></div>'
          + '<p>Posted by '+currentPost.postedBy+' at '+ currentPost.timestamp +
          '</p></div></div>';
      // append each of current users posts to html
      $('#user-posts').append(contentString);
    }
  }
  // coordinates of each post
  var lat = currentPost.location[0];
  var lng = currentPost.location[1];
  
  // place parking markers
  userPageMarkers(lat,lng);

})

// function to place parking markers
function userPageMarkers(lat, lng){
  var myLatLng = new google.maps.LatLng(lat, lng);
  var marker = new google.maps.Marker({ 
    position: myLatLng,
    icon: 'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png',
    map: userPageMap, 
    animation: google.maps.Animation.DROP, 
  })
}