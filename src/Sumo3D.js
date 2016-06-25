"use strict";


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

        // extra work if we need to render (client side only)
        if ((typeof window !== 'undefined') && document) {

            console.log('setting up client-side scene');

            // setup the scene
            this.scene = new Physijs.Scene();

            // setup camera 
            this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
            this.camera.position.set(0, 50, 5);
            this.camera.up = new THREE.Vector3(0,1,0);
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            this.scene.add(this.camera);

            // setup light
            var pointLight = new THREE.PointLight(0x0033ff, 3, 150);
            pointLight.position.set( 0, 20, 0 );
            this.scene.add(pointLight);

            // setup the renderer and add the canvas to the body
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            document.getElementById( 'viewport' ).appendChild( this.renderer.domElement );

            // TODO: the following two lines of code were created as part of physijs attemp
            this.THREE = THREE;
            this.Physijs = Physijs;
        } else {
            let THREE = require('./server/lib/three.js');
            let Ammo = require('./server/lib/ammo.js');
            let Physijs = require('./server/lib/physi.js')(THREE, Ammo);
            this.scene = new Physijs.Scene();
            this.THREE = THREE;
            this.Physijs = Physijs;
        }

        this.scene.setGravity(new this.THREE.Vector3(0, 0, 0));
    }

    // single step
    draw() {
        this.scene.simulate();
        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    // add one object
    addObject(id) {

        // setup a single sphere
        let sphereGeometry = new this.THREE.SphereGeometry(2, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
        let sphereMaterial = new this.THREE.MeshNormalMaterial();
        let sphere = new this.Physijs.SphereMesh( sphereGeometry, sphereMaterial );
        this.scene.add(sphere);
        return this.objects[id] = sphere;
    }

    removeObject(o) {
        this.scene.remove(o);
    }
}

module.exports = Sumo3D;
