'use strict';

const ServerEngine = require('incheon').ServerEngine;

class SumoServerEngine extends ServerEngine {
    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        this.serializer.registerClass(require('../common/Fighter'));
        this.serializer.registerClass(require('../common/SumoRing'));
    }
}

module.exports = SumoServerEngine;
