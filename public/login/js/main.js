var container, scene, camera, renderer;

var controls;

init();
animate();

function init(){
    // Setup
	//container = document.getElementById( 'container' );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 5;

	renderer = new THREE.WebGLRenderer( { alpha: true} );
	renderer.setSize( window.innerWidth, window.innerHeight);
}

function animate(){

}

function render(){

}