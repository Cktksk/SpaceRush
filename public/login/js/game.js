var config = {
    apiKey: "AIzaSyADQaehJejnsXhVt_oUdO8KSEZSp6REAV4",
    authDomain: "jojotankworld.firebaseapp.com",
    databaseURL: "https://jojotankworld.firebaseio.com",
    projectId: "jojotankworld",
    storageBucket: "jojotankworld.appspot.com",
    messagingSenderId: "61981639812"
};
var database = firebase.database();
var player;
var otherPlayers = {};
var playerID;
var current_user;

function load_Game() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            current_user = firebase.auth().currentUser;
            playerID = current_user.uid;
            //loadEnvironment();
            // load the player
            initMainPlayer();
            listenToOtherPlayers();
            //remove player from the scene when they leave 
            window.onunload = function () {
                database.ref("Players/" + playerID).remove();
            };

            window.onbeforeunload = function () {
                database.ref("Players/" + playerID).remove();
            };


        } else {
            // No user is signed in.
            console.log("You lose connect during the game");
            window.onunload = function () {
                database.ref("Players/" + playerID).remove();
            };

            window.onbeforeunload = function () {
                database.ref("Players/" + playerID).remove();
            };
        }
    });
    // load the environment

}
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

function initMainPlayer() {
    console.log(playerID);
    // database for current game
    database.ref("Players/" + playerID).set({
        orientation: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 }
        }
    });
    player = new Player(playerID);
    player.isMainPlayer = true;
    player.init();
}

function loadEnvironment() {
    var sphere_geometry = new THREE.SphereGeometry(1);
    var sphere_material = new THREE.MeshNormalMaterial();
    var sphere = new THREE.Mesh(sphere_geometry, sphere_material);
   
    scene.add(sphere);
}
