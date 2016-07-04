const SumoGameEngine = require('./SumoGameEngine');
const SumoClientEngine = require('./SumoClientEngine');
const SumoRenderer = require('./SumoRenderer');

let renderer = new SumoRenderer();
let gameEngine = new SumoGameEngine({ renderer: renderer});
let sumoClientEngine = new SumoClientEngine(gameEngine);
let startEpoch = (new Date()).getTime();
let currentClientStep = 0;
let stepRate = 60; // number of steps per second
let handleStepInterval = 5;  // at which interval are steps actually handled


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
