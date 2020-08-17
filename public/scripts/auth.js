   
   var firebaseConfig = {
    apiKey: "AIzaSyCH9xilRB3gdSKL1BaXDeeV3xAf3DoC4ZU",
    authDomain: "cse135-hw3-3ed39.firebaseapp.com",
    databaseURL: "https://cse135-hw3-3ed39.firebaseio.com",
    projectId: "cse135-hw3-3ed39",
    storageBucket: "cse135-hw3-3ed39.appspot.com",
    messagingSenderId: "490687426483",
    appId: "1:490687426483:web:b0feafaa08dfb8581365c6"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var functions = firebase.functions();
 //const logout = document.querySelector("#logout");
 
 const login = document.querySelector("#login");

 login.addEventListener('click', handleLogin);
 
 //logout.addEventListener('click', handleLogout);

 function handleLogin(){

    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
                    .then(function(result) { 

                        // The signed-in user info.
                        var user = {
                        	email: result.user.email,
                        	role: "user",
                        	admin: false
                    	};

                        var claimsCheck = functions.httpsCallable('claimsCheck');
                        claimsCheck(user)
	                    	.then(function(resp) {
	                    		console.log(resp.result);
				            	window.open("/dashboard");
				            })
	            		.catch(function(error) {
	              			var code = error.code;
	              			var message = error.message;
	              			console.log(message);	
	            		});

                          console.log(user.email);

                          
                    })
                    .catch(function(error) { 

                          var errorCode = error.code;
                          var errorMessage = error.message;
                          // The email of the user's account used.
                          var email = error.email;
                          // The firebase.auth.AuthCredential type that was used.
                          var credential = error.credential;

                          console.log("wrong credentials");
                          console.log(errorCode);
                    });



    	

 }

 function handleLogout(){

    firebase.auth().signOut().then(function() {

        window.open("https://www.google.com/");

        console.log("signed out");


        
        }).catch(function(error) {
          // An error happened.
          console.log(error);
        });
 }