"use strict";
const GameEngine = require('incheon').GameEngine;
const Fighter = require('./Fighter');
const Point= require('incheon').Point;
const Sumo3D = require('./Sumo3D');

class SumoGameEngine extends GameEngine {

    constructor(isServer) {
        super();
        this.registerClass(Fighter);
        this.sumo3D = new Sumo3D();
        this.sumo3D.init();
        this.isServer = !!isServer;  // this was needed for the authority to kill player
    }

    start() {
        super.start();

        // TODO: refactor world settings
        this.worldSettings = {
            width: 800,
            height: 600
        };
    };

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
                }
            }
        }
    };

    frameTick() {
        this.sumo3D.draw();
    }

    makeFighter(id) {
        if (id in this.world.objects){
            console.log("error, object with id ", id, " already exists");
            return null;
        }

        // create a fighter for this client
        let x = Math.random() * 20 - 10;
        let z = Math.random() * 20 - 10;
        var fighter = new Fighter(id, x, 25, z, 0, 0, 0);
        fighter.refreshPhysics(this.sumo3D);
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
