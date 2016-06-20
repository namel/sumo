const SumoGameEngine = require('./SumoGameEngine');
const SumoClientEngine = require('./SumoClientEngine');

var gameEngine = new SumoGameEngine();
var sumoClientEngine = new SumoClientEngine(gameEngine);


// on each render frame
function clientStep() {
    sumoClientEngine.step();
    window.requestAnimationFrame(clientStep);
}


// start the client and kick off the infinite render loop
sumoClientEngine.start();
window.requestAnimationFrame(clientStep);

