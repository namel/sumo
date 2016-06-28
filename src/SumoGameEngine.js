"use strict";
const GameEngine = require('incheon').GameEngine;
const Fighter = require('./Fighter');
const Point= require('incheon').Point;
const Sumo3D = require('./Sumo3D');

class SumoGameEngine extends GameEngine {

    constructor() {
        super();
        this.registerClass(Fighter);
        this.sumo3D = new Sumo3D();
        this.sumo3D.init();
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
                this.world.objects[objId].step(this.worldSettings);
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
        var fighter = new Fighter(id, x, 25, z);
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
