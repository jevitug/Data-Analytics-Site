var date = new Date().toLocaleString();
var url = window.location.href;
var userAgent = navigator.userAgent;
var language = navigator.language;
var cookies = navigator.cookieEnabled;
var maxWidth = window.screen.width;
var maxHeight = window.screen.height;
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
//var connection = navigator.connection.effectiveType;
jsonObj = [];




staticItems = {};
staticItems["time"] = date;
staticItems["url"] = url;
staticItems["userAgent"] = userAgent;
staticItems["language"] = language;
staticItems["cookies"] = cookies;
staticItems["maxWidth"] = maxWidth;
staticItems["maxHeight"] = maxHeight;
staticItems["windowWidth"] = windowWidth;
staticItems["windowHeight"] = windowHeight;
//staticItems["connection"] = connection;

const data = JSON.stringify(staticItems);
var cookie = "";
//navigator.sendBeacon('https://us-central1-cse135-hw3-3ed39.cloudfunctions.net/sessionize', data);
fetch('https://us-central1-cse135-hw3-3ed39.cloudfunctions.net/sessionize')
  .then((response) => {
  	//cookie = response.getHeaderNames();
  	console.log(response.headers);
    return (response);
  })
  .then((myJson) => {

    console.log(myJson);
  });


navigator.sendBeacon('https://us-central1-cse135-hw3-3ed39.cloudfunctions.net/collect?data=static', data);

var performance = JSON.stringify(window.performance.timing);
navigator.sendBeacon('https://us-central1-cse135-hw3-3ed39.cloudfunctions.net/collect?data=performance', performance);

events = [];
function logEvent(e) {
				let attributes = [
					'type',
					'srcElement',
					'currentTarget',
					'clientX',
					'clientY',
					'offsetX',
					'offsetY',
					'screenX',
					'screenY',
					'x',
					'y',
					'fromElement',
					'toElement',
					'keyCode',
					'altKey',
					'ctrlKey',
					'shiftKey',
					'button',
					'which'
				];

				let str = date + `EVENT LOG<br>`;

				for (let i = 0; i < attributes.length; i++) {
					str += `e.${attributes[i]} = ${e[attributes[i]]} <br />`;
				}

				events.push(str);

				if (events.length % 20 == 0){
					navigator.sendBeacon('https://us-central1-cse135-hw3-3ed39.cloudfunctions.net/collect?data=events', JSON.stringify(events));				
					events = [];
				}
			}

			window.addEventListener('DOMContentLoaded', function() {
				document.addEventListener('keydown', logEvent, false);
				document.addEventListener('mousemove', logEvent, false);
				document.addEventListener('click', logEvent, false);
				document.addEventListener('scroll', logEvent, false);
				//document.addEventListener('onunload', logEvent, false);
			});
