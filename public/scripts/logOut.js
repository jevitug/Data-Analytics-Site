
    var firebaseConfig = {
    apiKey: "AIzaSyBPu2UpvlSRbKBBtASyzZVNJyrAlHiaLSw",
    authDomain: "cse135-hw4-af3be.firebaseapp.com",
    databaseURL: "https://cse135-hw4-af3be.firebaseio.com",
    projectId: "cse135-hw4-af3be",
    storageBucket: "cse135-hw4-af3be.appspot.com",
    messagingSenderId: "985611544178",
    appId: "1:985611544178:web:133acaddefe998a7e344eb"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

 const logout = document.querySelector("#logout");
 
 logout.addEventListener('click', handleLogout);




 function handleLogout(){

    firebase.auth().signOut().then(function() {

        window.open("/index.html", "_self");

        window.alert(" You have signed out");


        
        }).catch(function(error) {
          // An error happened.
          console.log(error);
        });
 }