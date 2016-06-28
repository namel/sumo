"use strict";
const path = require('path');
const Fighter = require('./Fighter');
const ServerEngine = require('incheon').ServerEngine;

class SumoServerEngine extends ServerEngine{
    constructor(io, gameEngine, inputOptions){
        super(io, gameEngine, inputOptions);
        this.options.updateRate = 6;
        this.options.frameRate = 60;
    };

    start(){
        super.start();
    };

    step() {
        super.step();
        this.gameEngine.frameTick();
    }

    onPlayerConnected(socket){
        super.onPlayerConnected(socket);

        var that=this;

        this.gameEngine.makeFighter(socket.playerId);
    };

    onPlayerDisconnected(socketId, playerId){
        super.onPlayerDisconnected(socketId, playerId);

        delete this.gameEngine.world.objects[playerId];
    };

    onReceivedInput(inputData, socket){
        super.onReceivedInput(inputData, socket);
        this.gameEngine.processInput(inputData, socket.playerId)
    }

}

module.exports = SumoServerEngine;
