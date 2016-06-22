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
        this.sumo3D.step();
    };

    makeFighter(id) {
        if (id in this.world.objects){
            console.log("warning, object with id ", id, " already exists");
            return null;
        }

        // create a fighter for this client
        let x = Math.random() * 10;
        let y = Math.random() * 10;
        var fighter = new Fighter(id, x, y);
        this.world.objects[id] = fighter;

        return fighter;
    };

    processInput(inputData, playerId){

        var fighter = this.world.objects[playerId];
        
        if (fighter)
            fighter.nextMove = inputData;
    };

}

module.exports = SumoGameEngine;
