'use strict';

const PhysicalObject = require('incheon').serialize.PhysicalObject;
const RADIUS_TOP = 20;
const RADIUS_BOTTOM = 18;
const HEIGHT = 30;
const RADIUS_SEGMENTS = 64;
class SumoRing extends PhysicalObject {

    constructor(id, gameEngine, x, y, z) {
        super(id, x, y, z);
        this.class = Fighter;
        this.gameEngine = gameEngine;

        // create the physics body
        this.physicsObj = gameEngine.physicsEngine.addCylinder(RADIUS_TOP, RADIUS_BOTTOM, HEIGHT, RADIUS_SEGMENTS);

        // create the render object
        this.renderObj = gameEngine.renderer.addCylinder(RADIUS_TOP, RADIUS_BOTTOM, HEIGHT, RADIUS_SEGMENTS);
    }

    toString() {
        return `Fighter::${super.toString()}`;
    }

    destroy() {
        this.gameEngine.physicsEngine.removeBody(this.physicsObj);
        this.gameEngine.renderer.removeObject(this.renderObj);
    }

}

module.exports = SumoRing;
