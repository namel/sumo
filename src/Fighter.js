"use strict";
const Point= require('incheon').Point;
const Serializable= require('incheon').Composables.Serializable;

class Fighter extends Serializable {

    static get properties() {
        return  {
            id: 7, // class id
            name: "fighter"
        }
    }

    static get netScheme() {
        return {
            id: { type: Serializable.TYPES.UINT8 },
            x: { type: Serializable.TYPES.INT16 },
            y: { type: Serializable.TYPES.INT16 },
            velX: { type: Serializable.TYPES.FLOAT32 },
            velY: { type: Serializable.TYPES.FLOAT32 },
            angle: { type: Serializable.TYPES.INT16 }
        }
    }

    constructor(id, x, y) {
        super();
        this.id = id; //instance id
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;

        /*
        TODO: remove these
        this.angle = 90;
        this.rotationSpeed = 3;
        this.acceleration = 0.1;
        this.deceleration = 0.99;
        this.maxSpeed = 2;
        this.temp={ accelerationVector: new Point() };
        */

        this.class = Fighter;
    };

    destroy() {
        if (this.physicalObject) {
            this.sumo3D.removeObject(this.physicalObject);
        }
    }

    refreshPhysics(sumo3D) {
        this.sumo3D = sumo3D;
        if (this.physicalObject) {
            this.sumo3D.removeObject(this.physicalObject);
        }
        this.physicalObject = this.sumo3D.addObject(this.playerId);
        this.physicalObject.position.set(this.x, 0, -this.y);
        this.physicalObject.setLinearVelocity(new THREE.Vector3(this.velX, 0, - this.velY));
    }

    step(worldSettings) {

        // decelerate

        // handle next move
        if (this.nextMove) { 
            console.log(`Fighter processing move ${this.nextMove}`);

            // calculate the direction of the force from the input
            //  - the screen's X coincides with the scene X
            //  - the screen's Y coincides with the scene -Z
            //  - the screen does not control Y
            var moveDirection = new THREE.Vector3(this.nextMove.clientX - this.x, 0, (-this.nextMove.clientZ) - this.z);

            // apply a central impulse
            this.physicalObject.applyCentralImpule(moveDirection.normalize())
            this.nextMove = null;
        }
    }
}

module.exports = Fighter;

