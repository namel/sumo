const ClientEngine = require('incheon').ClientEngine;
const GameWorld = require('incheon').GameWorld;
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
            console.log(`click event: `, event);
            console.log(`click x-y = (${that.touchData.x},${that.touchData.y})`);
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
        // console.log(`STEP START: ${stepToPlay} prev-next ${previousWorld.stepCount} ${nextWorld.stepCount}`);

        // step 1: create new objects, interpolate existing objects
        for (let objId in nextWorld.objects) {
            if (nextWorld.objects.hasOwnProperty(objId)) {
                let prevObj = previousWorld.objects[objId];
                let nextObj = nextWorld.objects[objId];

                //todo refactor
                if (prevObj == null) {
                    prevObj = nextObj;
                }

                // if the object is new, add it
                if (!this.gameEngine.world.objects.hasOwnProperty(objId)) {
                    console.log(`adding new object ${objId} at (${nextObj.x},${nextObj.y},${nextObj.z}) velocity (${nextObj.velX},${nextObj.velY},${nextObj.velZ})`);
                    let localObj = this.gameEngine.world.objects[objId] = new Fighter(objId, nextObj.x, nextObj.y, nextObj.z, 0, 0, 0);
                    localObj.velX = nextObj.velX;
                    localObj.velY = nextObj.velY;
                    localObj.velZ = nextObj.velZ;
                    localObj.isPlayerControlled = (this.playerId == nextObj.id);
                }

                // update positions with interpolation
                var playPercentage = (stepToPlay - previousWorld.stepCount) / (nextWorld.stepCount - previousWorld.stepCount);
                world.objects[objId].x = (nextObj.x - prevObj.x) * playPercentage + prevObj.x;
                world.objects[objId].y = (nextObj.y - prevObj.y) * playPercentage + prevObj.y;
                world.objects[objId].z = (nextObj.z - prevObj.z) * playPercentage + prevObj.z;

                // interpolate rotation requires slerp which is available in Quaternions
                var localTHREE = this.gameEngine.sumo3D.THREE;
                var eRotationPrev = new localTHREE.Euler(prevObj.rx, prevObj.ry, prevObj.rz, 'XYZ');
                var eRotationNext = new localTHREE.Euler(nextObj.rx, nextObj.ry, nextObj.rz, 'XYZ');
                var qPrev = (new localTHREE.Quaternion()).setFromEuler(eRotationPrev);
                var qNext = (new localTHREE.Quaternion()).setFromEuler(eRotationNext);
                qPrev.slerp(qNext, playPercentage);
                var eRotationNow = new localTHREE.Euler().setFromQuaternion(qPrev, 'XYZ');
                world.objects[objId].rx = eRotationNow.x;
                world.objects[objId].ry = eRotationNow.y;
                world.objects[objId].rz = eRotationNow.z;
            }
        }

        // step 2: destroy unneeded objects
        for (let objId in previousWorld.objects) {
            if (previousWorld.objects.hasOwnProperty(objId) && !nextWorld.objects.hasOwnProperty(objId)) {

                // TODO: apparently objId is a string, but this.playerId is a number.  how is that not a problem?
                if (+objId === this.playerId) {
                    alert('You are dead, sumo.  Refresh the page to play again.');
                }
                console.log(`destroying unneeded ${objId}`);
                world.objects[objId].destroy();
                delete world.objects[objId];
            }
        }

        // step 3: refresh physics for objects that survived
        for (let objId in world.objects) {
            if (world.objects.hasOwnProperty(objId)) {
                let obj = world.objects[objId];
                obj.refreshPhysics(this.gameEngine.sumo3D);
                // console.log(`refreshing ${objId}`);
            }
        }

    }

    processInputs() {
        if (this.touchData) {
            let input = this.gameEngine.sumo3D.calculateImpulse(this.touchData.x, this.touchData.y, this.gameEngine.world.objects[this.playerId]);
            if (input) {
                console.log(`sending input to server ${JSON.stringify(input)}`);
                this.sendInput(input);
            }
            this.touchData = null;
        }
    }

}


module.exports = SumoClientEngine;
