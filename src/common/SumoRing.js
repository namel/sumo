'use strict';

const PhysicalObject = require('incheon').serialize.PhysicalObject;
const MASS = 0;

class SumoRing extends PhysicalObject {

    constructor(id, gameEngine, position) {
        super(id, position);
        this.class = SumoRing;
        this.gameEngine = gameEngine;
    }

    onAddToWorld(gameEngine) {

        // create the physics body
        this.gameEngine = gameEngine;
        this.physicsObj = gameEngine.physicsEngine.addBox(30, 3, 30, MASS);
        this.physicsObj.position.set(this.position.x, this.position.y, this.position.z);

        // create the render object
        if (gameEngine.renderer)
            this.renderObj = gameEngine.renderer.addSumoBox(this.position, 60, 6, 60);
    }

    toString() {
        return `SumoRing::${super.toString()}`;
    }

    destroy() {
        this.gameEngine.physicsEngine.removeBody(this.physicsObj);
        if (this.renderObj)
            this.gameEngine.renderer.removeObject(this.renderObj);
    }

}

module.exports = SumoRing;
