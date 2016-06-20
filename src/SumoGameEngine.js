"use strict";

const GameEngine = require('Incheon').GameEngine;
const Fighter = require('./Fighter');
const Point= require('Incheon').Point;
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

        var newFighterX = Math.floor(Math.random()*(this.worldSettings.width-200)) + 100;
        var newFighterY = Math.floor(Math.random()*(this.worldSettings.height-200)) + 100;

        var fighter = new Fighter(id, this.sumo3D, newFighterX, newFighterY);
        this.world.objects[id] = fighter;

        return fighter;
    };

    processInput(inputData, playerId){

        var fighter = this.world.objects[playerId];
        
        if (fighter)
            fighter.nextMove = inputData;
    };
}

module.exports = SpaaaceGameEngine;
