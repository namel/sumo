"use strict";

const THREEPhysicalObject = require('incheon').composables.THREEPhysicalObject;
const IMPULSE_STRENGTH = 20;

class Fighter extends THREEPhysicalObject {

    static get properties() {
        return {
            id: 8, // class id
            name: "fighter"
        }
    }

    constructor(id, x, y, z, rx, ry, rz) {
        super(id, x, y, z, rx, ry, rz); // note: calling apply with arguments array doesn't work on constructor
        this.class = Fighter;
    }

    init(options) {
        Object.assign(this, options);
    }

    // initalize the physics
    initPhysics(physicsEngine) {

        super.initPhysics(physicsEngine);
        this.updatePhysicsObject();
    }

    // update the physics object with current position/rotation
    updatePhysicsObject() {
        this.physicalObject.position.set(this.x, this.y, this.z);
        this.physicalObject.rotation.set(this.rx, this.ry, this.rz);
        this.physicalObject.__dirtyPosition = true;

    }

    // single step for this object
    step(worldSettings) {

        //console.log(`before step this object ${this.id} R(${this.x} ${this.y} ${this.z}) V(${this.velX} ${this.velY} ${this.velZ})`);
        // TODO: is this code still needed?
        if (this.physicalObject) {
            let pos = this.physicalObject.position;
            let rot = this.physicalObject.rotation;
            let vel = this.physicalObject.getLinearVelocity();

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
        // if we have a local physical object
        if (this.nextMove && this.physicalObject) {

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
