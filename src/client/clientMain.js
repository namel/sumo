const qsOptions = require('query-string').parse(location.search);
const SumoClientEngine = require('./SumoClientEngine');
const SumoGameEngine = require('../common/SumoGameEngine');
const CannonPhysicsEngine = require('incheon').physics.CannonPhysicsEngine;

// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: 1,
    delayInputCount: 3,
    clientIDSpace: 1000000,
    syncOptions: {
        sync: qsOptions.sync || 'extrapolate',
        localObjBending: 0.0,
        remoteObjBending: 0.8,
        bendingIncrements: 6
    }
};
let options = Object.assign(defaults, qsOptions);

// create the singletons
const physicsEngine = new CannonPhysicsEngine();
const gameOptions = Object.assign({ physicsEngine }, options);
const gameEngine = new SumoGameEngine(gameOptions);
const clientEngine = new SumoClientEngine(gameEngine, options);

document.addEventListener('DOMContentLoaded', function(e) { clientEngine.start(); });
