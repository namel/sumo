const SumoGameEngine = require('../common/SumoGameEngine');
const SumoClientEngine = require('./SumoClientEngine');
const SumoRenderer = require('./SumoRenderer');
const InterpolateStrategy = require('incheon').syncStrategies.InterpolateStrategy;
const FrameSyncStrategy = require('incheon').syncStrategies.FrameSyncStrategy;


// to test client-side physics engine, uncomment the lines below
// const SumoPhysicsEngine = require('../common/SumoPhysicsEngine.js');
// let physicsEngine = new SumoPhysicsEngine();

// create the singletons
const renderer = new SumoRenderer();
const gameEngine = new SumoGameEngine({ renderer, physicsEngine: null });
const sumoClientEngine = new SumoClientEngine(gameEngine);
const startEpoch = (new Date()).getTime();
const stepRate = 60; // number of steps per second
const handleStepInterval = 5;  // at which interval are steps actually handled
let currentClientStep = 0;

// choose synchronization strategy
if (window.location.search && window.location.search.indexOf('frameSyncMode') >= 0) {
    new FrameSyncStrategy(sumoClientEngine, {});
} else {
    new InterpolateStrategy(sumoClientEngine, {});
}

// on each render frame
function clientStep() {
    let currentEpoch = (new Date()).getTime();
    if (currentEpoch > (startEpoch + currentClientStep * (1000/stepRate))) {
        currentClientStep++;
        if (currentClientStep % handleStepInterval === 0) {
            //sumoClientEngine.step();
        }
    }
    sumoClientEngine.step();
    window.requestAnimationFrame(clientStep);
}


// start the client and kick off the infinite render loop
sumoClientEngine.start();
window.requestAnimationFrame(clientStep);
