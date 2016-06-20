"use strict";


const Point= require('Incheon').Point;
const Serializable= require('Incheon').Composables.Serializable;

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

    constructor(id, sumo3D, x, y) {
        super();
        this.id = id; //instance id

        /*
        TODO: remove these
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;
        this.angle = 90;
        this.rotationSpeed = 3;
        this.acceleration = 0.1;
        this.deceleration = 0.99;
        this.maxSpeed = 2;
        this.velocity = new Point();
        this.temp={ accelerationVector: new Point() };
        */

        this.class = Fighter;
        this.sumo3D = sumo3D;
        this.physicalObject = this.sumo3D.addObject(this.playerId);
    };

    step(worldSettings) {

        // decelerate

        // handle next move
        if (this.nextMove) { 
            console.log(this.nextMove);

            // calculate the direction of the force from the input

            // apply a central impulse
            this.physicalObject.applyCentralImpule(new THREE.Vector3(5, 5, 5));
        }
    }
}

module.exports = Fighter;

