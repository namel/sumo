const ClientEngine = require('incheon').ClientEngine;
const SumoRenderer = require('./SumoRenderer');

// The Sumo client-side engine
class SumoClientEngine extends ClientEngine {

    // constructor
    constructor(gameEngine, options) {
        super(gameEngine, options);

        this.renderer = this.gameEngine.renderer = new SumoRenderer(gameEngine, this);
        this.serializer.registerClass(require('../common/Fighter'));
        this.serializer.registerClass(require('../common/SumoRing'));
        this.gameEngine.on('client.preStep', this.processInputs.bind(this));
    }

    // start then client engine
    start() {
        super.start();
        if (this.verbose) console.log(`starting client, registering input handlers`);

        //  Game input
        let that = this;
        let el = document.getElementsByTagName('body')[0];
        el.addEventListener('click', function(event) {

            that.touchData = {
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: -(event.clientY / window.innerHeight) * 2 + 1
            };

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
