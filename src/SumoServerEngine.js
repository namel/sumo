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



    onReceivedInput(inputData, socket){
        super.onReceivedInput(inputData, socket);

    }

}

module.exports = SumoServerEngine;
