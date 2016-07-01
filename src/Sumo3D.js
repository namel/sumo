"use strict";

const SUMO_MASS = 6;
const FRICTION = 0.9;
const RESTITUTION = 0.5;

class Sumo3D {

    // constructor
    constructor() {
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
            this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.set(0, 35, 40);
            this.camera.up = new THREE.Vector3(0, 1, 0);
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            this.scene.add(this.camera);

            // setup light
            this.pointLight = new THREE.PointLight(0xffffff, 3, 150);
            this.pointLight.position.set(0, 40, 50);
            this.scene.add(this.pointLight);

            // setup the renderer and add the canvas to the body
            this.renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('viewport').appendChild(this.renderer.domElement);

            // a local raycaster
            this.raycaster = new THREE.Raycaster();

            // TODO: the following two lines of code were created as part of physijs attempt
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

        // common objects
        // setup floor
        let floorMaterial = this.Physijs.createMaterial(
            new this.THREE.MeshPhongMaterial({
                color: 0xde761a,
                wireframe: false
            }),
            FRICTION,
            RESTITUTION
        );
        this.floor = new this.Physijs.CylinderMesh(
            new this.THREE.CylinderGeometry(20, 18, 30, 64),
            floorMaterial,
            0); // gravity = 0 sets a fixed floor
        this.floor.position.set(0, -4, 0);
        this.scene.add(this.floor);

    }

    // given a point on the camera (screen click)
    // calculate a corresponding impulse
    calculateImpulse(x, y, selfObj) {
        let mouse = new this.THREE.Vector2(x, y);
        this.raycaster.setFromCamera(mouse, this.camera);
        let intersects = this.raycaster.intersectObjects(this.scene.children);

        for (let i in intersects) {
            if (intersects[i].object === this.floor) {
                let intersectPoint = intersects[i].point;
                let impulseVector = intersectPoint.sub(selfObj.physicalObject.position);
                // console.log(`calculated impulse ${JSON.stringify(impulseVector)}`);
                return impulseVector;
            }
        }

        console.log(`failed to calculate impulse`);
        return null;
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

        // generate a color which is random but not dark
        let r = Math.random();
        let g = Math.random();
        let b = Math.max(0, 1 - r - g);
        let objColor = new this.THREE.Color(r, g, b);

        // create the physical object
        console.log(`adding object in 3D with id${id} color${JSON.stringify(objColor)}`);
        let sphereGeometry = new this.THREE.SphereGeometry(2, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        let sphereMaterial = this.Physijs.createMaterial(
            new this.THREE.MeshPhongMaterial({
                color: objColor,
                wireframe: true
            }),
            FRICTION,
            RESTITUTION
        );
        let sphere = new this.Physijs.SphereMesh(sphereGeometry, sphereMaterial, SUMO_MASS);
        this.scene.add(sphere);
        return sphere;
    }

    removeObject(o) {
        this.scene.remove(o);
    }
}

module.exports = Sumo3D;
