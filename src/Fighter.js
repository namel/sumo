"use strict";
const Point = require('incheon').Point;
const Serializable = require('incheon').Composables.Serializable;
const IMPULSE_STRENGTH = 20;

class Fighter extends Serializable {

    static get properties() {
        return {
            id: 7, // class id
            name: "fighter"
        }
    }

    static get netScheme() {
        return {
            id: {
                type: Serializable.TYPES.UINT8
            },
            x: {
                type: Serializable.TYPES.FLOAT32
            },
            y: {
                type: Serializable.TYPES.FLOAT32
            },
            z: {
                type: Serializable.TYPES.FLOAT32
            },
            velX: {
                type: Serializable.TYPES.FLOAT32
            },
            velY: {
                type: Serializable.TYPES.FLOAT32
            },
            velZ: {
                type: Serializable.TYPES.FLOAT32
            }
        }
    }

    serialize() {
        // console.log(`Fighter.serialize() of this object ${this.id} ${this.x} ${this.y}`);
        return super.serialize(arguments);
    }

    constructor(id, x, y, z) {
        super();
        this.id = id; //instance id
        this.x = x;
        this.y = y;
        this.z = z;
        this.velX = 0;
        this.velY = 0;
        this.velZ = 0;
        this.class = Fighter;
    };

    destroy() {
        console.log(`destroying object ${this.id}`);
        if (this.physicalObject) {
            this.sumo3D.removeObject(this.physicalObject);
        }
    }

    refreshPhysics(sumo3D, keepMovement) {
        this.sumo3D = sumo3D;
        if (this.physicalObject) {
            if (keepMovement) {
                let pos = this.physicalObject.position;
                let vel = this.physicalObject.getLinearVelocity();
                this.x = pos.x;
                this.y = pos.y;
                this.z = pos.z;
                this.velX = vel.x;
                this.velY = vel.y;
                this.velZ = vel.z;
            }
        } else {
            this.physicalObject = this.sumo3D.addObject(this.id);
        }

        this.physicalObject.position.set(this.x, this.y, this.z);
        this.physicalObject.setLinearVelocity(new sumo3D.THREE.Vector3(this.velX, this.velY, this.velZ));
        this.physicalObject.__dirtyPosition = true;

        // console.log(`after refresh this object ${this.id} ${this.x} ${this.y}`);
    }

    step(worldSettings) {

        //console.log(`before step this object ${this.id} R(${this.x} ${this.y} ${this.z}) V(${this.velX} ${this.velY} ${this.velZ})`);
        if (this.physicalObject) {
            let pos = this.physicalObject.position;
            let vel = this.physicalObject.getLinearVelocity();

            if (this.x !== pos.x) {
                // console.log(`updating pos vel ${pos.x} ${-pos.z} ${vel.x} ${-vel.z}`);
            }
            this.x = pos.x;
            this.y = pos.y;
            this.z = pos.z;
            this.velX = vel.x;
            this.velY = vel.y;
            this.velZ = vel.z;
        }

        // handle next move
        if (this.nextMove) {

            // console.log(`Fighter processing move ${JSON.stringify(this.nextMove)}`);
            let input = this.nextMove.input;
            var moveDirection = new this.sumo3D.THREE.Vector3(input.x, 0, input.z);

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
