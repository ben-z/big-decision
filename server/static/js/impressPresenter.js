/******
****HELPER
*****/

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
} 


//***WORK***/
var api = impress();
    api.init();

    /****
    ***Socket Magic
    ****/
    "use strict";
    // Initialize everything when the window finishes loading
    window.addEventListener("load", function(event) {
      var socket;

      var serverUrl = "ws://localhost:8080/";
      var secID = "sec";
      var stepEnterTimeout = null;


      // open
        socket = new WebSocket(serverUrl, "echo-protocol");
        
        socket.onopen = function(){
            //Send INIT Presentation ID
            socket.send(JSON.stringify({presentation:'testFile', action:'addToPresentation'}));
            console.log("Send INIT Presentation ID");
        }


        // Display messages received from the server
        socket.addEventListener("message", function(event) {



        console.log(event.data)
        api.goto(Number(event.data));

        /***
        ***Only serve this to the presenter
        ***/
        var secID = "sec";


        // KEYBOARD NAVIGATION HANDLERS

        // Prevent default keydown action when one of supported key is pressed.
        document.addEventListener( "keydown", function( event ) {
            if ( event.keyCode === 9 ||
               ( event.keyCode >= 32 && event.keyCode <= 34 ) ||
               ( event.keyCode >= 37 && event.keyCode <= 40 ) ) {
                event.preventDefault();
            }
        }, false );
// Trigger impress action (next or prev) on keyup.

        // Supported keys are:
        // [space] - quite common in presentation software to move forward
        // [up] [right] / [down] [left] - again common and natural addition,
        // [pgdown] / [pgup] - often triggered by remote controllers,
        // [tab] - this one is quite controversial, but the reason it ended up on
        //   this list is quite an interesting story... Remember that strange part
        //   in the impress.js code where window is scrolled to 0,0 on every presentation
        //   step, because sometimes browser scrolls viewport because of the focused element?
        //   Well, the [tab] key by default navigates around focusable elements, so clicking
        //   it very often caused scrolling to focused element and breaking impress.js
        //   positioning. I didn't want to just prevent this default action, so I used [tab]
        //   as another way to moving to next step... And yes, I know that for the sake of
        //   consistency I should add [shift+tab] as opposite action...
    document.addEventListener( "keyup", function( event ) {
window.clearTimeout( stepEnterTimeout );
            stepEnterTimeout = window.setTimeout( function() {
        if ( event.shiftKey || event.altKey || event.ctrlKey || event.metaKey ) {
            return;
        }

        if ( event.keyCode === 9 ||
         ( event.keyCode >= 32 && event.keyCode <= 34 ) ||
         ( event.keyCode >= 37 && event.keyCode <= 40 ) ) {
            switch ( event.keyCode ) {
                    case 33: // Page up
                    case 37: // Left
                    case 38: // Up
                        socket.send(JSON.stringify({
                            "presentation":"testFile", 
                            "action":"prev",
                            "secID": "sec"
                        }));
                        console.log("Prev");
                    break;
                    case 9:  // Tab
                    case 32: // Space
                    case 34: // Page down
                    case 39: // Right
                    case 40: // Down        
                        socket.send(JSON.stringify({
                            "presentation":"testFile", 
                            "action":"next",
                            "secID": "sec"
                        }));
                        console.log("Next");
                    break;
                }

                event.preventDefault();
            }

            }, 0 );
        }, false );


// Touch handler to detect taps on the left and right side of the screen
// based on awesome work of @hakimel: https://github.com/hakimel/reveal.js
document.addEventListener( "touchstart", function( event ) {
    if ( event.touches.length === 1 ) {
        var x = event.touches[ 0 ].clientX,
        width = window.innerWidth * 0.3,
        result = null;

        if ( x < width ) {
            result = socket.send(secID + "prev");
        } else if ( x > window.innerWidth - width ) {
            result = socket.send(secID + "next");
        }

        if ( result ) {
            event.preventDefault();
        }
    }
}, false );
        });
    });
