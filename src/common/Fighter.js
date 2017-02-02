'use strict';

const PhysicalObject = require('incheon').serialize.PhysicalObject;
const RADIUS = 10;

class Fighter extends PhysicalObject {

    constructor(id, gameEngine, x, y, z) {
        super(id, x, y, z);
        this.class = Fighter;
        this.gameEngine = gameEngine;

        // create the physics body
        this.physicsObj = gameEngine.physicsEngine.addSphere(RADIUS);

        // create the render object
        this.renderObj = gameEngine.renderer.addSphere(RADIUS);
    }

    toString() {
        return `Fighter::${super.toString()}`;
    }

    destroy() {
        this.gameEngine.physicsEngine.removeObject(this.physicsObj);
        this.gameEngine.renderer.removeObject(this.renderObj);
    }

}

module.exports = Fighter;
