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
    }

    destroy(objectHandler) {
        console.log(`destroying object ${this.id}`);
        if (this.physicalObject) {
            objectHandler.removeObject(this.physicalObject);
        }
    }

    updateRenderingAttributes(renderer) {
        if (!this.physicalObject) {
            this.physicalObject = renderer.addObject(this.id);
        }

        this.physicalObject.position.set(this.x, this.y, this.z);
        this.physicalObject.rotation.set(this.rx, this.ry, this.rz);
    }


    // TODO: physicalObject means different things on client an server.  This is a bug.
    //       on client: the rendering object
    //       on server: the physijs object
    initPhysics(physicsEngine) {
        this.physicsEngine = physicsEngine;
        if (!this.physicalObject) {
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
