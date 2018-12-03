var Player = function (playerID) {
    this.playerID = playerID;
    this.isMainPlayer = false;
    this.mesh;
    this.score = 0;
    var sphere_geometry = new THREE.SphereGeometry(1);
    var sphere_material = new THREE.MeshBasicMaterial({ color: 0x7777ff, wireframe: false });

    var scope = this;
    this.init = function () {
        scope.mesh = new THREE.Mesh(sphere_geometry, sphere_material);
        scene.add(scope.mesh);

        if (scope.isMainPlayer) {
            // Give player control of this mesh
            controls = new THREE.PlayerControls(camera, scope.mesh);
            controls.init();
            controls.moveSpeed = 0.23;
            controls.turnSpeed = 0.03;
        }
    };

    this.setOrientation = function (position, rotation) {
        if (scope.mesh) {
            scope.mesh.position.copy(position);
            scope.mesh.rotation.x = rotation.x;
            scope.mesh.rotation.y = rotation.y;
            scope.mesh.rotation.z = rotation.z;

        }
    };
};