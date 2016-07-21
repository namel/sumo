const ClientEngine = require('incheon').ClientEngine;
const Fighter = require('../common/Fighter');


// The Sumo client-side engine
class SumoClientEngine extends ClientEngine {

    // constructor
    constructor(gameEngine) {
        super(gameEngine);
        this.verbose = true;
        this.gameEngine.on('client.preStep', this.processInputs.bind(this));
    }

    // start then client engine
    start() {
        super.start();
        if (this.verbose) console.log(`starting client, registering input handlers`);

        //  Game input
        let that = this;
        var el = document.getElementsByTagName("body")[0];
        el.addEventListener("click", function(event) {

            that.touchData = {
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: -(event.clientY / window.innerHeight) * 2 + 1
            }
            // console.log(`click event: `, event);
            // console.log(`click x-y = (${that.touchData.x},${that.touchData.y})`);
        }, false);
    }

    processInputs() {
        if (this.touchData) {
            let input = this.gameEngine.renderer.calculateImpulse(this.touchData.x, this.touchData.y, this.gameEngine.world.objects[this.playerId]);
            if (input) {
                // console.log(`sending input to server ${JSON.stringify(input)}`);
                this.sendInput(input);
            }
            this.touchData = null;
        }
    }

}


module.exports = SumoClientEngine;
