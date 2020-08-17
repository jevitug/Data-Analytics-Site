/*
from Prof:

<noscript>
  <img src="https://mysite.com/logger?scriptoff=true">
</noscript>

This would detect for the script being off and send an image request (assuming images are fetched though!) to the endpoint in the srcA similar idea could detect for CSS being on w/o JS
<div style="background: url(https://mysite.com/logger?csson=true)"></div>

and of course images on
<img src="https://mysite.com/logger?imageson=true">


static:
userAgent = navigator.userAgent;
language = navigator.language;
cookies = navigator.cookieEnabled;

maxWidth = window.screen.width;
maxHeight = window.screen.height;

windowWidth = window.innerWidth;
windowHeight = window.innerHeight;
  

  
  navigator.connection.Effectiveype;
*/
    
var keystrokes = function (event) {
	let buffer = [];

    buffer.push(event.key);
};
document.addEventListener('keydown', keystrokes);

date = new Date().toLocaleString();

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
staticItems["userAgent"] = userAgent;
staticItems["language"] = language;
staticItems["cookies"] = cookies;
staticItems["maxWidth"] = maxWidth;
staticItems["maxHeight"] = maxHeight;
staticItems["windowWidth"] = windowWidth;
staticItems["windowHeight"] = windowHeight;
//staticItems["connection"] = connection;
jsonObj.push(staticItems);

var performance = window.performance.timing;

jsonObj.push(performance);


localStorage.setItem(date, JSON.stringify(jsonObj));


// todo: use timeout
var mouseX, mouseY;
var mouseMovement = function(event) {
	checkMouse = false;
	setTimeout(function(){
	    if(event.offsetX) {
	        mouseX = event.offsetX;
	        mouseY = event.offsetY;
	    }
	    else if(event.layerX) {
	        mouseX = event.layerX;
	        mouseY = event.layerY;
	    }
		//console.log(mouseX,mouseY);

		document.addEventListener('mousemove', mouseMovement, {
			once: true}
		);
	}, 2000);
};

document.addEventListener('mousemove', mouseMovement, {
	once: true
});

var clickCount = 0;
document.addEventListener('click', function(){
	clickCount = clickCount+1;
});

window.addEventListener('beforeunload', function(){

});

document.addEventListener('scroll', function(){

	//console.log(window.scrollY);
});

var idle_message = function(){
	console.log("IDLE");
	clearTimeout(timer);
	idle(idle_message, 2000);
};

var idle = function(f, threshold){
	timer = setTimeout(f, threshold);

	document.onmousemove = function() {
		clearTimeout(timer);
		timer = setTimeout(f, threshold);
	}
};

idle(idle_message, 2000);

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

				let str = `EVENT LOG<br>`;

				for (let i = 0; i < attributes.length; i++) {
					str += `e.${attributes[i]} = ${e[attributes[i]]} <br />`;
				}
			
				events.push(str);
				if (jsonObj.length == 3){
					jsonObj.pop();
					
				}
				jsonObj.push(events);
				localStorage.setItem(date, JSON.stringify(jsonObj));

			}

			window.addEventListener('DOMContentLoaded', function() {
				document.addEventListener('keydown', logEvent, false);
				document.addEventListener('mousemove', logEvent, false);
				document.addEventListener('click', logEvent, false);
				document.addEventListener('scroll', logEvent, false);
				//document.addEventListener('onunload', logEvent, false);
			});
