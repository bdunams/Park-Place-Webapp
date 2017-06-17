// Park-Place Google Login Code

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
var currentUser = {};

// click events
$('#sign-in').on('click', userSignIn);
$('#sign-out').on('click', userSignOut);

// function to sign in a user
function userSignIn() {
  console.log('sign-in')
  // if no current user exists, sign in user 
  if (!firebase.auth().currentUser) {
    // Create provider
    var provider = new firebase.auth.GoogleAuthProvider();

    //provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    // Google Sign-in
    firebase.auth().signInWithPopup(provider).then(function(result){
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // send email verification
      user.sendEmailVerification().then(function() {
        // Email sent.
      }, function(error) {
        // An error happened.
      });
      
      currentUser = user;
      console.log(currentUser);

    }).catch(function(error){
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
    });
  }
  else{
    // user is already signed in
  }
}

  
// function to signout user
function userSignOut() {
  firebase.auth().signOut();
}
  
// user state observer 
firebase.auth().onAuthStateChanged(function(user) {
  if (user){
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    
    $('#sign-in').hide();
    $('#sign-out').show();
    
    $('#display-name').text(', '+displayName);
  } 
  else{
    // User is signed out.
    // possible signout actions
    $('#sign-out').hide();
    $('#sign-in').show();
    
    $('#display-name').empty();
  }
})