'use strict';

const GameEngine = require('incheon').GameEngine;
const ThreeVector = require('incheon').serialize.ThreeVector;
const Fighter = require('./Fighter');
const SumoRing = require('./SumoRing');
const IMPULSE_STRENGTH = 12;

//todo check if this should be global
let CANNON = null;


class SumoGameEngine extends GameEngine {

    constructor(options) {
        super(options);

        CANNON = this.physicsEngine.CANNON;

        this.on('server__playerJoined', this.makeFighter.bind(this));
        this.on('server__playerDisconnected', this.removeFighter.bind(this));
        this.on('server__init', this.gameInit.bind(this));
    }

    gameInit() {
        this.sumoRing = new SumoRing(++this.world.idCount, this);
        this.sumoRing.position.y = -4;
        this.addObjectToWorld(this.sumoRing);
    }

    start() {
        super.start();

        // TODO: refactor world settings
        this.worldSettings = {
            width: 800,
            height: 600
        };
    }


    // the Sumo Game Engine Step.
    step() {

        super.step();

        // on server-side:
        // decide if fighter has died
        for (let objId of Object.keys(this.world.objects)) {
            let obj = this.world.objects[objId];
            if (this.isServer && obj.y < -100) {
                console.log(`object ${objId} has fallen off the board`);
                this.resetFighter({ playerId: objId });
            }
        }
    }

    resetFighter(fighter) {
        fighter.x = Math.random() * 20 - 10;
        fighter.y = Math.random() * 20 - 10;
        fighter.initPhysicsObject(this.physicsEngine);
        console.log(`reset Fighter#${newGuy.playerId} at ${fighter.x},${fighter.y},${fighter.z}`);
    }

    // server-side function to add a new player
    makeFighter(player) {

        // create a fighter for this client
        let x = Math.random() * 20 - 10;
        let z = Math.random() * 20 - 10;
        let position = new ThreeVector(x, 25, z);
        let fighter = new Fighter(++this.world.idCount, this, position);
        fighter.playerId = player.playerId;
        this.addObjectToWorld(fighter);

        return fighter;
    }

    removeFighter(player) {
        let o = this.world.getPlayerObject(player.playerId);
        this.removeObjectFromWorld(o.id);
    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // apply a central impulse
        let moveDirection = new CANNON.Vec3(inputData.input.x, 0, inputData.input.z);
        moveDirection.normalize();
        moveDirection = moveDirection.scale(IMPULSE_STRENGTH);
        let playerSumo = this.world.getPlayerObject(playerId);
        let sphere = playerSumo.physicsObj;
        let playerSumoCenter = sphere.position.clone();
        sphere.applyImpulse(moveDirection, playerSumoCenter);
    }

}

module.exports = SumoGameEngine;
