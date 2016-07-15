const SumoGameEngine = require('./SumoGameEngine');
const SumoClientEngine = require('./SumoClientEngine');
const SumoRenderer = require('./SumoRenderer');
const SumoPhysicsEngine = require('./SumoPhysicsEngine.js');


const renderer = new SumoRenderer();
const physicsEngine = new SumoPhysicsEngine();
const gameEngine = new SumoGameEngine({ renderer: renderer, physicsEngine: null});
const sumoClientEngine = new SumoClientEngine(gameEngine);
const startEpoch = (new Date()).getTime();
const stepRate = 60; // number of steps per second
const handleStepInterval = 5;  // at which interval are steps actually handled
let currentClientStep = 0;


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
