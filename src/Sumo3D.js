


class Sumo3D {

    // constructor
    constructor() {
        this.objects = {}
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }

    // setup the 3D scene
    init() {

        // setup the scene
        this.scene = new Physijs.Scene();

        // extra work if we need to render (client side only)
        if (window && document) {

            // setup camera 
            this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
            this.camera.position.z = 10;


            // setup the renderer and add the canvas to the body
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( this.renderer.domElement );
        }
    }

    // single step
    step() {
        scene.simulate();
    }

    // add one object
    addObject(id) {

        // setup a single sphere
        let sphereGeometry = new THREE.SphereGeometry(3, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
        let sphereMaterial = new THREE.MeshNormalMaterial();
        let sphere = new Physijs.SphereMesh( sphereGeometry, sphereMaterial );
        this.scene.add(sphere);
        return = this.objects[id] = sphere;
    }
}

module.exports = Sumo3D;
