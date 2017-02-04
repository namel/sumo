'use strict';

const PhysicalObject = require('incheon').serialize.PhysicalObject;
const RADIUS = 4;
const MASS = 5;

class Fighter extends PhysicalObject {

    constructor(id, gameEngine, position) {
        super(id, position);
        this.class = Fighter;
        this.gameEngine = gameEngine;
    }

    onAddToWorld(gameEngine) {

        // create the physics body
        this.gameEngine = gameEngine;
        this.physicsObj = gameEngine.physicsEngine.addSphere(RADIUS, MASS);
        this.physicsObj.position.set(this.position.x, this.position.y, this.position.z);

        // create the render object
        if (gameEngine.renderer)
            this.renderObj = gameEngine.renderer.addSumoFighter(this.position, RADIUS);
    }

    toString() {
        return `Fighter::${super.toString()}`;
    }

    destroy() {
        this.gameEngine.physicsEngine.removeObject(this.physicsObj);
        if (this.renderObj)
            this.gameEngine.renderer.removeObject(this.renderObj);
    }

}

module.exports = Fighter;
