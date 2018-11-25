var container, scene, camera, renderer;
var controls;
var collideMeshList = [];
var circles = [];
var counter = 0;
var deg = Math.PI / 2;
var crash;
var timeStart;
var timeSurvived;
var deathzone = 20.5;
var goalzone = 141.7;

init();
animate();

function init() {
	// Setup
	container = document.getElementById('signed_in');

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.z = 5;

	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setSize(window.innerWidth, window.innerHeight);

	// load game
	load_Game();
	//initCycle();
	//initball();
	
	timeStart = Date.now();
	// Events
	window.addEventListener("resize", onWindowResize, false);
	container.appendChild(renderer.domElement);
	document.body.appendChild(container);
	game_state = "start";
}

function animate() {
	requestAnimationFrame(animate);
	render();
	var random_t = getRandomInt(0, 100);
	if (random_t <= 10 && counter <= 500) {
		makeRandomSphere();
		counter++;
	}

	var distance_from_zero = Math.sqrt(Math.pow(player.mesh.position.x, 2) + Math.pow(player.mesh.position.z, 2));
	if (controls) {
		setTimeout(ballmove(), 3000);
		var originPoint = player.mesh.position.clone();
		for (var vertexIndex = 0; vertexIndex < player.mesh.geometry.vertices.length; vertexIndex++) {
			var localVertex = player.mesh.geometry.vertices[vertexIndex].clone();
			var globalVertex = localVertex.applyMatrix4(player.mesh.matrix);
			var directionVector = globalVertex.sub(player.mesh.position);
			var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
			var collisionResults = ray.intersectObjects(collideMeshList);
			if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
				crash = true;
				break;
			}
			crash = false;
		}
		controls.update();
		if (crash && game_state == "start") {
			console.log("Crash");
			timeSurvived = Date.now() - timeStart;
			gameOver();
		}
	}

	// generate random spheres
	/*
	// move the ball
	if (random_t == 1) {
		ballmove();
	}*/
	// checking for crash


}
function gameOver() {
	document.getElementById("ldb").innerHTML = "";
	window.alert("Game Over, you got hit by a comet!");
	game_state = "over";
	document.getElementById("html_body").style.backgroundImage = "url(http://www.gamesta.com/wp-content/uploads/2014/08/destiny3.jpg)";
	document.getElementById("not_signed_in").style.display = "none";
	document.getElementById("signed_in").style.display = "none";
	document.getElementById("game_over").style.display = "initial";
	var user_display = current_user.displayName;
	if (!user_display) {
		user_display = current_user.email;
	}
	document.getElementById('status').innerHTML = "Player: " + user_display + " survived for\n" + timeSurvived / 1000 + "s.";
	var score_ref = firebase.database().ref('Stored/' + playerID);
	score_ref.on('value', function (snapshot) {
		var data = snapshot.val();
		//console.log(data.highest_score);
		if (!data || data.highest_score < (timeSurvived / 1000) || !data.highest_score) {
			database.ref("Stored/" + playerID).set({
				name: user_display,
				highest_score: timeSurvived / 1000
			});
		}
	});
	writeScores();


}
function writeScores() {
	document.getElementById("ldb").innerHTML = "";
	var leadRef = database.ref('Stored/');
	leadRef.on('value', function (snapshot) {
		snapshot.forEach(function (childSnapshot) {
			var nameData = childSnapshot.val().name + ", score: ";
			var scoreData = childSnapshot.val().highest_score;
			var node = document.createElement("tr");
			var nameth = document.createElement("th");
			var scoreth = document.createElement("th");
			var nameTxt = document.createTextNode(nameData);
			var scoreTxt = document.createTextNode(scoreData);
			nameth.appendChild(nameTxt);
			scoreth.appendChild(scoreTxt);
			node.appendChild(nameth);
			node.appendChild(scoreth);
			document.getElementById("ldb").appendChild(node);

		});
	});

}

function render() {
	renderer.clear();
	renderer.render(scene, camera);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

// return a random number which can be either float or int
function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}
// return a random number which has to be int
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function makeRandomSphere() {
	var a = getRandomInt(1, 3),
		b = getRandomInt(1, 4);
	var geometry = new THREE.SphereGeometry(a);
	var material = new THREE.MeshBasicMaterial({
		color: Math.random() * 0xffffff
	});
	var box = new THREE.Mesh(geometry, material);
	//var box = new THREE.BoxHelper(object);
	//box.material.color.setHex(Math.random() * 0xffffff);
	box.position.x = getRandomArbitrary(-55, 55);
	box.position.y = 0;
	box.position.z = getRandomArbitrary(-75, -155);
	//cubes.push(box);
	collideMeshList.push(box);
	scene.add(box);
	console.log("Sphere added")
}

function ballmove() {
	deg += 1 / 3 * Math.PI / 180;
	collideMeshList.forEach((ball, index) => {

		//ball.position.x += 1;
		ball.position.z += 1 * getRandomArbitrary(0.5, 0.9);

		/*
		database.ref("Balls/" + index).update({
			position: {
				x: ball.position.x,
				y: ball.position.y,
				z: ball.position.z
			}
		});
		*/
	})
}

function initCycle() {
	for (var j = 2; j < 15; j++) {
		var radius = 10 * j;
		var lineGeometry = new THREE.Geometry();
		for (var i = 0; i < 2 * Math.PI; i += Math.PI / 30) {
			lineGeometry.vertices.push(new THREE.Vector3(radius * Math.cos(i), 0, radius * Math.sin(i), 0))
		}
		var material = new THREE.MeshBasicMaterial({
			color: Math.random() * 0xffffff
		});
		var cycleMesh = new THREE.Line(lineGeometry, material);
		cycleMesh.position.set(0, 0, 0);
		scene.add(cycleMesh);
		circles.push(radius)
	}
}
function initball() {
	for (var i = 2; i < 15; i++) {
		var geometry = new THREE.SphereGeometry(2 + i / 2, 22, 16);
		var material = new THREE.MeshBasicMaterial({
			color: Math.random() * 0xffffff
		});
		ball = new THREE.Mesh(geometry, material);
		ball.position.set(10 * i, 0, 0);
		/*
		database.ref("Balls/" + collideMeshList.indexOf(ball)).set({
			position: {
				x: ball.position.x,
				y: ball.position.y,
				z: ball.position.z
			}
		});
		*/
		scene.add(ball);
		collideMeshList.push(ball)
	}
}
function getColor() {
	var colorValue = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
	var colorArray = colorValue.split(",");
	var color = "#";
	for (var i = 0; i < 6; i++) {
		color += colorArray[Math.floor(Math.random() * 16)];
	}
	return color;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}