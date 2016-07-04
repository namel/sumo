"use strict";
const GameEngine = require('incheon').GameEngine;
const Fighter = require('./Fighter');
const Point= require('incheon').Point;
const Sumo3D = require('./Sumo3D');

class SumoGameEngine extends GameEngine {

    constructor(isServer, physicsEngine) {
        super({}, physicsEngine);
        this.registerClass(Fighter);
        this.isServer = !!isServer;  // this was needed for the authority to kill player
        if (!this.isServer) {
            this.sumo3D = new Sumo3D();
            this.sumo3D.init();
        }
    }

    start() {
        super.start();

        // TODO: refactor world settings
        this.worldSettings = {
            width: 800,
            height: 600
        };
    };

    // the Sumo Game Engine Step.
    //
    // 1. for each object, invoke that object's step
    //    each object will check if it must handle an input
    //    and record its position/rotation
    //    TODO: shouldn't the above "record position/rotation" happen
    //          after the physics step?
    // 2. call the physics engine step
    //
    step() {

        this.world.stepCount++;
        for (var objId in this.world.objects) {
            if (this.world.objects.hasOwnProperty(objId)) {
                let obj = this.world.objects[objId];
                obj.step(this.worldSettings);
                if (this.isServer && obj.y < -100) {
                    console.log(`object ${objId} has fallen off the board`);
                    obj.destroy();
                    delete this.world.objects[objId];
                    this.makeFighter(objId);
                }
            }
        }

        if (this.physicsEngine) {
            this.physicsEngine.step();
        }

    };

    // TODO: get rid of isServer
    frameTick(isServer) {
        if (!isServer) {
            this.sumo3D.draw();
        }
    }

    // only called on server
    makeFighter(id) {
        if (id in this.world.objects){
            console.log("error, object with id ", id, " already exists");
            return null;
        }

        // create a fighter for this client
        let x = Math.random() * 20 - 10;
        let z = Math.random() * 20 - 10;
        var fighter = new Fighter(id, x, 25, z, 0, 0, 0);
        fighter.refreshPhysics(this.physicsEngine);
        this.world.objects[id] = fighter;
        console.log(`created Fighter#${id} at ${fighter.x},${fighter.y},${fighter.z}`);

        return fighter;
    };

    processInput(inputData, playerId){

        //console.log(`game engine processing player[${playerId}] ${JSON.stringify(inputData)}`);
        var fighter = this.world.objects[playerId];

        if (fighter)
            fighter.nextMove = inputData;
    };

}

module.exports = SumoGameEngine;
