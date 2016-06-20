const SumoGameEngine = require('./SumoGameEngine');
const SumoClientEngine = require('./SumoClientEngine');

var gameEngine = new SumoGameEngine();
var SumoClientEngine = new SumoClientEngine(gameEngine);


// on each render frame
function clientStep() {
    SumoClientEngine.step();
    window.requestAnimationFrame(clientStep);
}


// start the client and kick off the infinite render loop
SumoClientEngine.start();
window.requestAnimationFrame(clientStep);

