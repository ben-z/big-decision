#!/usr/bin/env node
//Requirements
var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path')
var express = require('express')
var cookieParser = require('cookie-parser')

var clients = [];

var presentations = []

var secID = "sec";


/**********
**********
***********
*****SERVER
********
********/

var app = express()
/*Use hbs as template rendering engine*/
  app.set('view engine', 'hbs')
/*Allow us to use cookies*/
  app.use(cookieParser())
/**
**When accessing root - create new presentation
*/
  app.get('/', function(req, res){
    console.log("New Presentation")
    /*Create SecKey*/
      var newSecKey = Math.round((Math.pow(36, 10 + 1) - Math.random() * Math.pow(36, 10))).toString(36).slice(1)
      console.log("SECKey: " + newSecKey)
    /*Create random presentation id*/
      var newPresentationID = Math.round((Math.pow(36, 5 + 1) - Math.random() * Math.pow(36, 5))).toString(36).slice(1)
      while(fs.existsSync("files/" + newPresentationID + ".json")){
        newPresentationID = Math.round((Math.pow(36, 5 + 1) - Math.random() * Math.pow(36, 5))).toString(36).slice(1)
      }
    /*Save the empty presentation file*/
      fs.writeFile("files/"+newPresentationID+".json", "", function(err) {
        if(err) {
          return console.log(err);
        }
        console.log("The new presentation " + newPresentationID + ".json was saved!");
      }); 
      /*Render the newPresentation*/
      console.log("PRES ID:" + newPresentationID)
      res.render("newPresentation", {
        presID : newPresentationID,
        secKey : newSecKey
      })

      /*Set the presenter key*/
      res.cookie('presenter', newSecKey, { maxAge: 900000, httpOnly: true });
  })

/*use the whole static folder*/
  app.use(express.static('static'))


/*
**Regarding to the rights, serve the javascript with send command
*/
  app.get('/js/socket.js/:presID', function (req, res) {

    console.log('Cookies: ', req.cookies['presenter'])
    /*****
    *** make ==
    ***/
    if(req.cookies['presenter'] != secID){      
      /*Render the presenterJS with the given data*/
        console.log("PRES ID:" + req.params.presID)
        for(var i = 0; i < presentations.length; i++){
          if(presentations[i].ID == req.params.presID){
            res.render("impressPresenter", {
              presID : req.params.presID,
              secKey : "sec"
            })
            break
          }
        }
    }else{
      /*Render the clientJS with the given data*/
        console.log("PRES ID:" + req.params.presID)
        res.render("impressClient", {
          presID : req.params.presID
        })
    }
  })

app.listen(8080, function () {
  console.log('Webserver listening on 8080!')
})

/**
***Save the json POST request to a file
**/
app.post('/s/:ID', function (req, res) {
  var jsonString = '';
  req.on('data', function (data) {
    jsonString += data;
  });

  req.on('end', function () {
    fs.writeFile("files/" + req.params.ID + ".json", jsonString, function (err) {
      if (err) throw err;
        console.log(req.params.ID + ".json is saved");
    });
  });
});
/**
*** Get the presentation in view mode
***/
  app.get('/p/:ID', function (req, res) {
    //Get the data from the file
      fs.readFile(path.resolve("files/"+ req.params["ID"] +".json"), 'utf8', (err, data) =>{

        /*
        **Error handlihg
        */
          if(err){
            /*It there is no file we asume that the user wants to create a new presentation*/
              if(err['errno'] == -2){
                console.log("Presentation does not exist -> Redirecting to root")
                res.writeHead(302, {
                  'Location': '/'
                });
                res.end();
              }else{
                console.log(err)
              }
        /*
        **If there are no errors parse the data into the template
        */
          }else{
            /*Parse the data from the file into a JSON object*/
              var JSONData = JSON.parse(data)
            /*Search in array weather there is already a presentation setup*/
              var found = false
              /*Iterate trough the presentation array and check if there is already the current presentation as object*/
                for(var i = 0; i < presentations.length; i++){
                  console.log("ID "+ presentations[i].ID)
                  if(presentations[i].ID == req.params.ID){
                    found = true;
                    console.log("Found instance")
                    break;
                  }
                }
              /*If there is no presentation instance, create one*/
              console.log("slides size" +  JSONData.slides.length)
                if(!found){
                  var newPresentationInstance = {
                    "ID" : JSONData.presID,
                    "currentStep" : 0,
                    "slidesNum" : JSONData.slides.length,
                    "secKey" : JSONData.secKey,
                    "clients" : []
                  }
                  presentations.push(newPresentationInstance)
                  console.log("Pushed new instance")
                }

              /*Render the presentation with the given data*/
                res.render("index", {
                  siteTitle : JSONData.title,
                  presID : JSONData.presID,
                  secKey : JSONData.secKey,
                  slides: JSONData.slides
                })
          }
      });
  })



/************
************
*************
****SOCKET
***********
************
***********/
/***
****Startup the server
***/
var socketServer = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
socketServer.listen(9292, function() {
    console.log((new Date()) + ' Websocket Server is listening on port 9292');
});

wsServer = new WebSocketServer({
    httpServer: socketServer,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

/*Actual running function*/
wsServer.on('request', function(request) {
    /*Check if origin is Allowed -> !PREVENTING Misuse*/
      if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
          request.reject();
          console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
          return;
      }

    /*Open a new connection to the client*/
      var connection = request.accept('echo-protocol', request.origin);
      console.log((new Date()) + ' Connection accepted. With Code ' + request);

    /*Recieving message from client*/
      connection.on('message', function(message) {
        console.log("Clients connected: " + clients.length);
        if (message.type === 'utf8') {
          /*Parse JSONString to object*/
            jsonMessage = JSON.parse(message.utf8Data)

            /*
            **Check the message for valid structure
            */
              /*Check for the presentation ID*/                
                var currentPresentation = null
                var found = false

                for(var i = 0; i < presentations.length; i++){
                  console.log("ID "+ presentations[i].ID)
                  if(presentations[i].ID == jsonMessage.presentation){
                    found = true;
                    currentPresentation = presentations[i]
                    console.log("Found instance")
                    break;
                  }
                }

                if(!found){
                  console.log("WebSocketServer not found instance")
                  return
                }
                console.log(jsonMessage.secID == currentPresentation.secKey )

              /*Presenter tells us to go previous*/
                if(currentPresentation != null && jsonMessage.secID == currentPresentation.secKey && jsonMessage.action == "prev"){
                  currentPresentation.currentStep--;

                  console.log("Clients go previous! Step: " + currentPresentation.currentStep);

                  for(var i = 0; i < currentPresentation.clients.length;i++){
                    currentPresentation.clients[i].sendUTF((currentPresentation.currentStep%currentPresentation.slidesNum));
                  }
              /*Presenter tells us to go next*/ 
                }else if(currentPresentation != null && jsonMessage.secID == currentPresentation.secKey && jsonMessage.action == "next"){
                  currentPresentation.currentStep += 1;
                  console.log("Clients go Next! Step: " + currentPresentation.currentStep);

                  for(var i = 0; i < currentPresentation.clients.length;i++){
                    currentPresentation.clients[i].sendUTF((currentPresentation.currentStep%currentPresentation.slidesNum));
                  }
              /*Clients do an inital send, at the begining to register to a presentation*/
                }else if(jsonMessage.action = "addToPresentation"){
                  /*Check for the presentation ID*/                
                    var currentPresentation = null
                    var found = false

                    for(var i = 0; i < presentations.length; i++){
                      console.log("ID "+ presentations[i].ID)
                      if(presentations[i].ID == jsonMessage.presentation){
                        found = true;
                        currentPresentation = presentations[i]
                        console.log("Found instance")
                        break;
                      }
                    }

                    if(!found){
                      console.log("WebSocketServer not found instance")
                      return
                    }

                  /*Add the client to the array*/
                    currentPresentation.clients.push(connection);
                    console.log("Pushed init connection to presentations")
                  /*Send inital slide*/
                    connection.sendUTF((currentPresentation.currentStep%currentPresentation.slidesNum));
              /*If none of the above -> Invalid command*/
                }else{
                  console.log("Invalid command!: "+ message.utf8Data);
                }
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        //Slice old Connections to don't send to dead nodes
        // for(var i = 0; i < clients.length;i++){
        //   if(clients[i] == connection){
        //     clients.splice(i);
        //     break;
        //   }
        // }
    });
});


