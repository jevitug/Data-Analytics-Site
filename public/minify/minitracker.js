date=(new Date).toLocaleString();var url=window.location.href,userAgent=navigator.userAgent,language=navigator.language,cookies=navigator.cookieEnabled,maxWidth=window.screen.width,maxHeight=window.screen.height,windowWidth=window.innerWidth,windowHeight=window.innerHeight;jsonObj=[],staticItems={},staticItems.url=url,staticItems.userAgent=userAgent,staticItems.language=language,staticItems.cookies=cookies,staticItems.maxWidth=maxWidth,staticItems.maxHeight=maxHeight,staticItems.windowWidth=windowWidth,staticItems.windowHeight=windowHeight;const data=JSON.stringify(staticItems);navigator.sendBeacon("https://us-central1-cse135-hw3-3ed39.cloudfunctions.net/sessionize",data),jsonObj.push(staticItems);var mouseX,mouseY,performance=window.performance.timing;jsonObj.push(performance),navigator.sendBeacon("https://us-central1-cse135-hw3-3ed39.cloudfunctions.net/sessionize",JSON.stringify(performance)),localStorage.setItem(date,JSON.stringify(jsonObj));var mouseMovement=function(e){checkMouse=!1,setTimeout(function(){e.offsetX?(mouseX=e.offsetX,mouseY=e.offsetY):e.layerX&&(mouseX=e.layerX,mouseY=e.layerY),document.addEventListener("mousemove",mouseMovement,{once:!0})},2e3)};document.addEventListener("mousemove",mouseMovement,{once:!0});var clickCount=0;document.addEventListener("click",function(){clickCount+=1}),window.addEventListener("beforeunload",function(){}),document.addEventListener("scroll",function(){});var idle_message=function(){console.log("IDLE"),clearTimeout(timer),idle(idle_message,2e3)},idle=function(e,t){timer=setTimeout(e,t),document.onmousemove=function(){clearTimeout(timer),timer=setTimeout(e,t)}};function logEvent(e){let t=["type","srcElement","currentTarget","clientX","clientY","offsetX","offsetY","screenX","screenY","x","y","fromElement","toElement","keyCode","altKey","ctrlKey","shiftKey","button","which"],n="EVENT LOG<br>";for(let o=0;o<t.length;o++)n+=`e.${t[o]} = ${e[t[o]]} <br />`;events.push(n),3==jsonObj.length&&jsonObj.pop(),jsonObj.push(events),navigator.sendBeacon("https://us-central1-cse135-hw3-3ed39.cloudfunctions.net/sessionize",JSON.stringify(events))}idle(idle_message,2e3),events=[],window.addEventListener("DOMContentLoaded",function(){document.addEventListener("keydown",logEvent,!1),document.addEventListener("mousemove",logEvent,!1),document.addEventListener("click",logEvent,!1),document.addEventListener("scroll",logEvent,!1)});