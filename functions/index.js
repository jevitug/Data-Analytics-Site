const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { uuid } = require('uuidv4');
const url = require('url');

var firebaseConfig = {
    apiKey: "AIzaSyCH9xilRB3gdSKL1BaXDeeV3xAf3DoC4ZU",
    authDomain: "https://cse135-hw3-3ed39.firebaseapp.com",
    //databaseURL: "https://cse135-hw3-3ed39.firebaseio.com",
    projectId: "cse135-hw3-3ed39",
    //storageBucket: "cse135-hw3-3ed39.appspot.com",
    //messagingSenderId: "308217984910",
    //appId: "1:308217984910:web:fe9d7c8828c340a8f1d6df",
    //measurementId: "G-89M114G1KW"
  };


class UnauthenticatedError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.type = 'UnauthenticatedError';
    }
}

class NotAnAdminError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.type = 'NotAnAdminError';
    }
}

class InvalidRoleError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.type = 'InvalidRoleError';
    }
}

admin.initializeApp(firebaseConfig);
 
var cookieName = "";

let db = admin.firestore();

exports.sessionize = functions.https.onRequest((request, response) => {
    
     var date = new Date();
     let name = "userId";
     let name2 = "sessionId"
     let days = 10;
     var value1 = uuid();
     var value2 = uuid();
     
     date.setTime(date.getTime() + (days*24*60*60*1000));
     expires = "; expires=" + date.toUTCString();
     
     var cookieString = name + "=" + (value1 || "")  + expires + "; path=/";
     
     var cookieString2 = name2 + "=" + (value2);

        //for
     var userValue = {

        value:value1
     }


     var sessionValue = {

        value:value2
     }
      var setDoc;
      var setDoc2;

       //response.send(cookieName);

    //check if header has cookies
    if(request.headers.cookie){

      let cookie = {};
      request.headers.cookie.split(';').forEach(function(el) {
        let [k,v] = el.split('=');
        cookie[k.trim()] = v;
      })

      cookieName = cookie["sessionId"];
      //check if cookies is in database
      let session = db.collection('sessions').doc(cookieName);
      let getDoc = session.get()
      .then(doc => {
        if (!doc.exists) {

            response.setHeader("Set-Cookie", cookieString);

            response.setHeader("Set-Cookie", cookieString2);
           //response.setHeader("Set-Cookie", [cookieString, cookieString2]);
            response.setHeader('Access-Control-Allow-Origin', '*');

             // Add a new document in collection "cities" with ID 'LA'
           setDoc = db.collection("sessions").doc(value2).set(sessionValue);
           setDoc2 = db.collection("Users").doc(value1).set(userValue);
              
        } else {
          console.log('Document data:', doc.data());
        }
        return null;
      })
      .catch(err => {
        console.log('Error getting document', err);
      })
    }

     
    //no cookies in header
     else {
      	response.setHeader("Set-Cookie", cookieString);

        response.setHeader("Set-Cookie", cookieString2);

        //response.setHeader("Set-Cookie", [cookieString, cookieString2]);

        response.setHeader('Access-Control-Allow-Origin', '*');

         // Add a new document in collection "cities" with ID 'LA'
       setDoc = db.collection("sessions").doc(value2).set(sessionValue);
       setDoc2 = db.collection("Users").doc(value1).set(userValue);
     
     }

    response.end();
    });

exports.collect = functions.https.onRequest((request, response) => {
	var data = JSON.parse(request.body);
	var date = new Date().toString();

var query = url.parse(request.url,true).query["data"];
console.log(request.headers.referer);
  switch(query){
      case "static":
          db.collection("data").doc(date).set({
              static: data
          },
          {merge: true}
          );
          break;
      case "performance":
          db.collection("data").doc(date).set({
              performance: data
          },
          {merge: true}
          );
          break;
      case "events":
          db.collection("data").doc(date).set({
              events: data
          },
          {merge: true}
          );
          break;
      default:
          db.collection("data").doc(date).set({
              data: data
          },
          {merge: true}
          );
          break;
  }
  response.end();
});


exports.claimsCheck = functions.https.onCall(async(data, context) => {

  try{
    const callerUid = context.auth.uid;  


  	var docRef = db.collection("userAuth").doc(data.email);
  	docRef.get().then(function(doc) {
  	    if (doc.exists) {
  	        console.log("Document data:", doc.data());
            return {result:"Checking for claims"};
  	    } else {

  	      const newUser = {
  		      email: data.email,
  	      }

  	      const userRecord = admin.auth().createUser(newUser);

    		  const claims = {};


          db.collection("userAuth").doc(data.email).set(data);
    	    admin.auth().setCustomUserClaims(data.email, claims);

  	        
          return { result: 'The new user has been successfully created.' };
  	    }
  	}).catch(function(error) {
  	    console.log("Error getting document:", error);
        return {result:error};
  	});


  }catch (error) {
    return {result: error};
    //throw new functions.https.HttpsError('internal', error.message);
  }

});

exports.check = functions.https.onCall(async(data, context) => {
    try {

        //Checking that the user calling the Cloud Function is authenticated
        if (!context.auth) {
            throw new UnauthenticatedError('The user is not authenticated. Only authenticated Admin users can access this page.');
        }
        console.log("Logged in");
        const callerUid = context.auth.uid;  
        const callerUserRecord = await admin.auth().getUser(callerUid);


        const userEmail = callerUserRecord.email;


        var docRef = db.collection("userAuth").doc(userEmail);
        docRef.get().then(function(doc) {
            var check = doc.data().admin;
            if (doc.exists) {
  
                return check;

            } else {
                console.log("User not found");
                throw new InvalidRoleError("User not found in database.");
            }
        }).catch(function(error) {
            throw error;
        });

    } catch (error) {

        if (error.type === 'UnauthenticatedError') {
            throw new functions.https.HttpsError('unauthenticated', error.message);
        } else if (error.type === 'NotAnAdminError' || error.type === 'InvalidRoleError') {
            throw new functions.https.HttpsError('failed-precondition', error.message);
        } else {
            throw new functions.https.HttpsError('internal', error.message);
        }

    }

});
