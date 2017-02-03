'use strict';

const PhysicalObject = require('incheon').serialize.PhysicalObject;
const MASS = 0;
const RADIUS_TOP = 20;
const RADIUS_BOTTOM = 18;
const HEIGHT = 30;
const RADIUS_SEGMENTS = 64;

class SumoRing extends PhysicalObject {

    constructor(id, gameEngine, position) {
        super(id, position);
        this.class = SumoRing;
        this.gameEngine = gameEngine;
    }

    joinGame(gameEngine) {

        // create the physics body
        this.gameEngine = gameEngine;
        this.physicsObj = gameEngine.physicsEngine.addCylinder(RADIUS_TOP, RADIUS_BOTTOM, HEIGHT, RADIUS_SEGMENTS, MASS);
        this.physicsObj.position.copy(this.position);

        // create the render object
        if (gameEngine.renderer)
            this.renderObj = gameEngine.renderer.addSumoRing(this.position, RADIUS_TOP, RADIUS_BOTTOM, HEIGHT, RADIUS_SEGMENTS);
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
