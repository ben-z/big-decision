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
    });

  });
