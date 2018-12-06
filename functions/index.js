const functions = require('firebase-functions');
var http = require("http");
var path = require('path');
var fs = require('fs');

exports.listening = functions.https.onRequest((req, res) => {
  
});


function listenToOtherPlayers() {
  // when a player is added, do something
  database.ref("Players").on("child_added", function (playerData) {
      if (playerData.val()) {
          if (playerID != playerData.key && !otherPlayers[playerData.key]) {
              otherPlayers[playerData.key] = new Player(playerData.key);
              otherPlayers[playerData.key].init();
              database.ref("Players/" + playerData.key).on("value", listenToPlayer);
          }
      }
  });

  // when a player is removed, do something

  database.ref("Players").on("child_removed", function (playerData) {
      if (playerData.val()) {
          database.ref("Players/" + playerData.key).off("value", listenToPlayer);
          scene.remove(otherPlayers[playerData.key].mesh);
          delete otherPlayers[playerData.key];
      }
  });
}
function listenToPlayer(playerData) {
  if (playerData.val()) {
      otherPlayers[playerData.key].setOrientation(playerData.val().orientation.position, playerData.val().orientation.rotation);
  }
}

var server = http.createServer(function(req, res){
	var fileName = path.basename(req.url) || 'index.html'; 
	var ext = path.extname(fileName); // extension for filename
	var localFolder = __dirname + '/';

	console.log("Recieved request for " + fileName + " in the folder : " + localFolder);

	if (!extensions[ext]){
		res.writeHead(404, {'Content-Type': 'text/html'});
		res.end("&lt;html&gt;&lt;head&gt;&lt;/head&gt;&lt;body&gt;The requested file type is not supported&lt;/body&gt;&lt;/html&gt;");
	}

	getFile((localFolder + fileName), res, extensions[ext]);
});

server.listen(5000);