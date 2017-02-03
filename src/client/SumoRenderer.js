'use strict';

const Renderer = require('incheon').render.Renderer;

class SumoRenderer extends Renderer {

    // constructor
    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }

    // setup the 3D scene
    init() {

        super.init();

        console.log('setting up client-side scene');

        // setup the scene
        this.scene = new THREE.Scene();

        // setup camera
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 35, 40);
        this.camera.up = new THREE.Vector3(0, 1, 0);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(this.camera);

        // setup light
        this.scene.add(new THREE.AmbientLight(0x606060));
        this.pointLight = new THREE.PointLight(0xffffff, 2, 100);
        this.pointLight.position.set(15, 40, 15);
        this.pointLight.castShadow = true;
        this.pointLight.shadowDarkness = 0.15;
        this.pointLight.shadow.camera.near = 1;
        this.pointLight.shadow.camera.far = 100;
        this.pointLight.shadow.bias = 0.01;
        this.scene.add(this.pointLight);

        // setup the renderer and add the canvas to the body
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        document.getElementById('viewport').appendChild(this.renderer.domElement);

        // a local raycaster
        this.raycaster = new THREE.Raycaster();

        return Promise.resolve();
    }

    // given a point on the camera (screen click)
    // calculate a corresponding impulse
    calculateImpulse(x, y, selfObj) {
        let mouse = new THREE.Vector2(x, y);
        this.raycaster.setFromCamera(mouse, this.camera);
        let intersects = this.raycaster.intersectObjects(this.scene.children);

        for (let i in intersects) {
            if (intersects[i].object === this.floor) {
                let intersectPoint = intersects[i].point;
                let impulseVector = intersectPoint.sub(selfObj.renderObject.position);
                return impulseVector;
            }
        }

        console.log(`failed to calculate impulse`);
        return null;
    }

    // single step
    draw() {
        super.draw();
        this.renderer.render(this.scene, this.camera);
    }

    // add one object: a single sphere
    addSumoFighter(position, radius) {

        // generate a color which is random but not dark
        let r = Math.random();
        let g = Math.random();
        let b = Math.max(0, 1 - r - g);
        let objColor = new THREE.Color(r, g, b);

        // create the visual object
        let sphereGeometry = new THREE.SphereGeometry(radius, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        let sphereMaterial = new THREE.MeshPhongMaterial({
            color: objColor,
            wireframe: true,
            shininess: 10
        });
        let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        sphere.position.copy(position);
        this.scene.add(sphere);
        return sphere;
    }

    addSumoRing(position, radiusTop, radiusBottom, height, radiusSegments) {
        // setup floor
        let floorMaterial = new THREE.MeshPhongMaterial({
            color: 0xde761a,
            wireframe: false,
            shininess: 30
        });
        this.floor = new THREE.Mesh(
            new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments),
            floorMaterial);
        this.floor.position.copy(position);
        this.floor.receiveShadow = true;
        this.scene.add(this.floor);

        return this.floor;
    }

    removeObject(o) {
        this.scene.remove(o);
    }
}

module.exports = SumoRenderer;
