'use strict';
const PhysijsPhysicsEngine = require('incheon').physics.PhysijsPhysicsEngine;
const SUMO_MASS = 6;
const FRICTION = 0.9;
const RESTITUTION = 0.5;

class SumoPhysicsEngine extends PhysijsPhysicsEngine {

    constructor() {
        super();
    }

    init() {
        // super creates a scene, and provides instances of THREE and Physijs
        super.init();

        // TODO: the following lines of code exist both in render and in
        // physics.  How do we resolve this?  Physics and rendering
        // have some common code/data !
        let floorMaterial = this.Physijs.createMaterial(
            new this.THREE.MeshPhongMaterial({
                color: 0xde761a,
                wireframe: false,
                shininess: 30
            }),
            FRICTION,
            RESTITUTION
        );
        this.floor = new this.Physijs.CylinderMesh(
            new this.THREE.CylinderGeometry(20, 18, 30, 64),
            floorMaterial,
            0); // gravity = 0 sets a fixed floor
        this.floor.position.set(0, -4, 0);
        this.floor.receiveShadow = true;
        this.scene.add(this.floor);
    }

    addObject() {


        // TODO: remove all render-specific logic from this file!


        // setup a single sphere

        // generate a color which is random but not dark
        let r = Math.random();
        let g = Math.random();
        let b = Math.max(0, 1 - r - g);
        let objColor = new this.THREE.Color(r, g, b);

        // create the physical object
        console.log(`adding physics object`);
        let sphereGeometry = new this.THREE.SphereGeometry(2, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        let sphereMaterial = this.Physijs.createMaterial(
            new this.THREE.MeshPhongMaterial({
                color: objColor,
                wireframe: true,
                shininess: 10
            }),
            FRICTION,
            RESTITUTION
        );
        let sphere = new this.Physijs.SphereMesh(sphereGeometry, sphereMaterial, SUMO_MASS);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        this.scene.add(sphere);
        return sphere;
    }

    removeObject(o) {
        this.scene.remove(o);
    }

}

module.exports = SumoPhysicsEngine;
