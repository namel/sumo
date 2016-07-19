"use strict";
const GameEngine = require('incheon').GameEngine;
const Fighter = require('./Fighter');
const Point= require('incheon').Point;

class SumoGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.registerClass(Fighter);
        this.isServer = !!this.options.isServer;  // this was needed for the authority to kill player

        // TODO: clean-up this/that by binding all functions to this?
        var that = this;
        this.on('server.playerJoined', this.makeFighter.bind(this));
        this.on('server.playerDisconnected', function(e) {
            delete that.world.objects[e.playerId];
        });
        this.on('server.inputReceived', function(e) {
            that.processInput(e.input, e.playerId);
        })
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
    step() {

        super.step();

        // on server-side:
        // decide if fighter has died
        for (var objId in this.world.objects) {
            if (this.world.objects.hasOwnProperty(objId)) {
                let obj = this.world.objects[objId];
                if (this.isServer && obj.y < -100) {
                    console.log(`object ${objId} has fallen off the board`);
                    obj.destroy();
                    delete this.world.objects[objId];
                    this.makeFighter({playerId: objId});
                }
            }
        }
    };

    // server-side function to add a new player
    makeFighter(newGuy) {
        if (newGuy.playerId in this.world.objects){
            console.log("error, object with id ", newGuy.playerId, " already exists");
            return null;
        }

        // create a fighter for this client
        let x = Math.random() * 20 - 10;
        let z = Math.random() * 20 - 10;
        var fighter = new Fighter(newGuy.playerId, x, 25, z, 0, 0, 0);
        fighter.initPhysicsObject(this.physicsEngine);
        this.world.objects[newGuy.playerId] = fighter;
        console.log(`created Fighter#${newGuy.playerId} at ${fighter.x},${fighter.y},${fighter.z}`);

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
