"use strict";

const PhysicalObject = require('incheon').composables.PhysicalObject;
const IMPULSE_STRENGTH = 20;

class Fighter extends PhysicalObject {

    static get properties() {
        return {
            id: 8, // class id
            name: "fighter"
        }
    }

    constructor(id, x, y, z, rx, ry, rz) {
        super(id, x, y, z, rx, ry, rz);  // note: calling apply with arguments array doesn't work on constructor
        this.class = Fighter;
        this.renderer = null;
        this.renderObject = null;
        this.physicsEngine = null;
        this.physicalObject = null;
    }

    init(options) {
        Object.assign(this, options);
    }

    destroy() {
        console.log(`destroying object ${this.id}`);

        // destroy the physicalObject
        if (this.physicalObject) {
            this.physicsEngine.removeObject(this.physicalObject);
        }

        // destroy the renderObject
        if (this.renderObject) {
            this.renderer.removeObject(this.renderObject);
        }
    }

    // update the attributes of the rendering engine
    updateRenderingAttributes() {
        if (!this.renderObject) {
            this.renderObject = this.renderer.addObject(this.id);
        }

        this.renderObject.position.set(this.x, this.y, this.z);
        this.renderObject.rotation.set(this.rx, this.ry, this.rz);
    }


    // TODO: merge syncInterpolated and updateRenderingAttributes to a single
    // function.  Originally I though "syncInterpolated()" would be part of the
    // physicalObject base class and "updateRenderingAttributes()" would be
    // renderer-specific, i.e. in a derived class.
    syncInterpolated(obj1, obj2, percent) {
        // TODO: switch from three parameters (x,y,z) to a single Point instance
        // TODO: switch from three parameters (rx,ry,rz) to a single Euler instance
        // interpolate the position coordinate values
        this.x = (obj2.x - obj1.x) * percent + obj1.x;
        this.y = (obj2.y - obj1.y) * percent + obj1.y;
        this.z = (obj2.z - obj1.z) * percent + obj1.z;

        // interpolate the rotation values
        var eRotationPrev = new THREE.Euler(obj1.rx, obj1.ry, obj1.rz, 'XYZ');
        var eRotationNext = new THREE.Euler(obj2.rx, obj2.ry, obj2.rz, 'XYZ');
        var qPrev = (new THREE.Quaternion()).setFromEuler(eRotationPrev);
        var qNext = (new THREE.Quaternion()).setFromEuler(eRotationNext);
        qPrev.slerp(qNext, percent);
        var eRotationNow = new THREE.Euler().setFromQuaternion(qPrev, 'XYZ');
        this.rx = eRotationNow.x;
        this.ry = eRotationNow.y;
        this.rz = eRotationNow.z;
    }



    // initalize the physics
    initPhysics(physicsEngine) {

        if (!this.physicalObject) {
            this.physicsEngine = physicsEngine;
            this.physicalObject = physicsEngine.addObject(this.id);
        }

        this.physicalObject.position.set(this.x, this.y, this.z);
        this.physicalObject.rotation.set(this.rx, this.ry, this.rz);
        this.physicalObject.__dirtyPosition = true;

        // console.log(`after refresh this object ${this.id} ${this.x} ${this.y}`);
    }

    step(worldSettings) {

        //console.log(`before step this object ${this.id} R(${this.x} ${this.y} ${this.z}) V(${this.velX} ${this.velY} ${this.velZ})`);
        if (this.physicalObject) {
            let pos = this.physicalObject.position;
            let rot = this.physicalObject.rotation;
            let vel = this.physicalObject.getLinearVelocity();

            if (this.x !== pos.x) {
                // console.log(`updating pos vel ${pos.x} ${-pos.z} ${vel.x} ${-vel.z}`);
            }
            this.x = pos.x;
            this.y = pos.y;
            this.z = pos.z;
            this.rx = rot.x;
            this.ry = rot.y;
            this.rz = rot.z;
            this.velX = vel.x;
            this.velY = vel.y;
            this.velZ = vel.z;
        }

        // handle next move
        // TODO: we check if we are on server by looking at window.  This is awful
        //       once we break physicalObject and renderObject this will no longer
        //       be necessary
        if (this.nextMove && (typeof window === 'undefined')) {

            // console.log(`Fighter processing move ${JSON.stringify(this.nextMove)}`);
            let input = this.nextMove.input;
            var moveDirection = new this.physicsEngine.THREE.Vector3(input.x, 0, input.z);

            // apply a central impulse
            moveDirection.normalize().multiplyScalar(IMPULSE_STRENGTH);
            console.log(`applying impulse towards ${JSON.stringify(moveDirection)}`);
            this.physicalObject.applyCentralImpulse(moveDirection)
            this.nextMove = null;
        }
        //console.log(`after step this object ${this.id} R(${this.x} ${this.y} ${this.z}) V(${this.velX} ${this.velY} ${this.velZ})`);
    }
}

module.exports = Fighter;
