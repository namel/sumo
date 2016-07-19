const ClientEngine = require('incheon').ClientEngine;
const Fighter = require('./Fighter');


// The Sumo client-side engine
class SumoClientEngine extends ClientEngine {

    // constructor
    constructor(gameEngine) {
        super(gameEngine);
        this.verbose = true;
        this.options.syncStrategy = {
            handleObject: function() {}
        }
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

    // a single client step processes the inputs and
    // updates the physics engine
    step() {

        // important to process inputs before running the game engine loop
        this.processInputs();
        super.step();
        var world = this.gameEngine.world;

        //todo alter step count based on lag
        var stepToPlay = this.gameEngine.world.stepCount - 6;
        var previousWorldIndex;
        var nextWorldIndex;
        var previousWorld = null;
        var nextWorld = null;

        // get two world snapshots that occur, one before current step,
        // and one equal to or immediately greater than current step
        for (let x = 0; x < this.worldBuffer.length; x++) {
            if (this.worldBuffer[x].stepCount < stepToPlay) {
                previousWorld = this.worldBuffer[x];
                previousWorldIndex = x;
            }
            if (this.worldBuffer[x].stepCount >= stepToPlay) {
                nextWorld = this.worldBuffer[x];
                nextWorldIndex = x;
                break;
            }
        }

        // determine current positions by interpolating
        // between the two worlds
        if (!previousWorld || !nextWorld)
            return;

        // create new objects, interpolate existing objects
        for (let objId in nextWorld.objects) {
            if (nextWorld.objects.hasOwnProperty(objId)) {
                let prevObj = previousWorld.objects[objId];
                let nextObj = nextWorld.objects[objId];
                let curObj = null;

                // TODO: refactor
                if (prevObj == null) {
                    prevObj = nextObj;
                }

                // if the object is new, add it
                if (!world.objects.hasOwnProperty(objId)) {
                    console.log(`adding new object ${objId} at (${nextObj.x},${nextObj.y},${nextObj.z}) velocity (${nextObj.velX},${nextObj.velY},${nextObj.velZ})`);
                    curObj = world.objects[objId] = new Fighter(objId, nextObj.x, nextObj.y, nextObj.z, 0, 0, 0);
                    curObj.init({
                        velX: nextObj.velX,
                        velY: nextObj.velY,
                        velZ: nextObj.velZ,

                        // TODO: the comparison below cannot be '===' because:
                        //       curObj.id = "1"
                        //       nextObj.id = 1
                        isPlayerControlled: (this.playerId == nextObj.id)
                    });
                    curObj.initRenderObject(this.gameEngine.renderer);

                    // if this game keeps a physics engine on the client side,
                    // we need to update it as well
                    if (this.gameEngine.physicsEngine) {
                        curObj.initPhysicsObject(this.gameEngine.physicsEngine);
                    }
                }

                // handle step for this object
                curObj = world.objects[objId];
                if (curObj.isPlayerControlled && curObj.physicalObject) {

                    // if the object is the self, update render position/rotation from physics
                    curObj.updateRenderObject();
                } else {
                    // update positions with interpolation
                    var playPercentage = (stepToPlay - previousWorld.stepCount) / (nextWorld.stepCount - previousWorld.stepCount);
                    if (typeof curObj.interpolate === 'function') {
                        curObj.interpolate(prevObj, nextObj, playPercentage);

                        // if this object has a physics sub-object, it must inherit
                        // the position now.
                        if (curObj.physicalObject && typeof curObj.updatePhysicsObject) {
                            curObj.updatePhysicsObject();
                        }
                    }
                }
            }
        }

        // destroy unneeded objects
        for (let objId in previousWorld.objects) {
            if (previousWorld.objects.hasOwnProperty(objId) && !nextWorld.objects.hasOwnProperty(objId)) {

                // TODO: apparently objId is a string, but this.playerId is a number.
                //       how is that not a problem?
                if (+objId === this.playerId) {
                    alert('You are dead, sumo.  Refresh the page to play again.');
                }
                console.log(`destroying unneeded ${objId}`);
                world.objects[objId].destroy();
                delete world.objects[objId];
            }
        }
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
