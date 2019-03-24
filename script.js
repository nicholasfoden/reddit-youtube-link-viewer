// ==UserScript==
// @name         Youtube Link Title Viewer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  View youtube titles before clicking them
// @author       desol
// @match        <$URL$>
// @grant        GM_xmlhttpRequest
// @include      *reddit*
// @exclude      *youtube*
// @exclude      *youtu.be*
// @connect      youtube.com
// @connect      youtu.be
// ==/UserScript==

// element we are interested in
let element;

(function() {
    'use strict';
    console.log("running yt title viewer");
    document.addEventListener("mouseover", magic);
})();

/**
 * Match anything we hover over to check for youtube links
 */
 function magic(input){
     // Match youtube urls
     let re = new RegExp(/youtube\.com|youtu\.be/gi);
     // Check for youtube link
     if(input.target.href && re.test(input.target.href)){
         // Save the hovered element for later
         element = input.target;
         // Parameters for our XHR request
         var request = {
             headers: {
                 "User-Agent": "Mozilla/5.0",
                 "Accept": "text/html"
             },
             method: "GET",
             url: decodeURI(input.target.href),
             onload: displayTitle, // display the title in place of the link's text
         }
         // Fetch the page
         var youtube = GM_xmlhttpRequest(request);
     }
 }

/**
 * Change the link text to match the youtube video title
 */
 function displayTitle(response){
     // We need a html DOM to find our title element
     let page = new DOMParser().parseFromString(response.responseText, 'text/html');
     // We get a wierd response from youtube with a XHR req but the title is available as '#eow-title' or '.watch-title'
     let title = page.querySelector('#eow-title').title;
     console.log(title);
     // Change the current link to the title
     element.textContent = title;

 }
