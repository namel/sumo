const ClientEngine = require('incheon').ClientEngine;
const GameWorld = require('incheon').GameWorld;
const Fighter = require('./Fighter');



// The Sumo client-side engine
class SumoClientEngine extends ClientEngine{

    // constructor
    constructor(gameEngine){
        super(gameEngine);
        this.verbose = true;
        this.options.syncStrategy = {
            handleObject: function() {}
        }
    }

    // start then client engine
    start(){
        super.start();
        if (this.verbose) console.log(`starting client, registering input handlers`);

        //  Game input
        let that = this;
        var el = document.getElementsByTagName("body")[0];
        el.addEventListener("touchstart", (e) => { this.touchData = e; }, false);
        el.addEventListener("touchend", (e) => { this.touchData = null; }, false);
        el.addEventListener("touchcancel", (e) => { this.touchData = null; }, false);
        el.addEventListener("touchmove", (e) => { this.touchData = e; }, false);
    }

    // a single client step processes the inputs and
    // updates the physics engine
    step(){


        // important to process inputs before running the game engine loop
        this.processInputs();
        super.step();

        // update player object
        var world = this.gameEngine.world;
        for (var objId in world.objects) {
            if (world.objects.hasOwnProperty(objId)) {
                if (this.playerId == objId){
                    let objectData = world.objects[objId];

                }
            }
        }

        //todo alter step count based on lag
        var stepToPlay = this.gameEngine.world.stepCount - 6;
        var previousWorldIndex;
        var nextWorldIndex;
        var previousWorld = null;
        var nextWorld = null;


        // get two world snapshots that occur, one before current step,
        // and one equal to or immediately greater than current step
        for (let x=0; x<this.worldBuffer.length; x++ ){
            if (this.worldBuffer[x].stepCount < stepToPlay){
                previousWorld = this.worldBuffer[x];
                previousWorldIndex = x;
            }
            if (this.worldBuffer[x].stepCount >= stepToPlay){
                nextWorld = this.worldBuffer[x];
                nextWorldIndex = x;
                break;
            }
        }

        // determine current positions by interpolating 
        // between the two worlds
        if (!previousWorld || !nextWorld)
            return;
        console.log(`STEP START: ${stepToPlay} prev-next ${previousWorld.stepCount} ${nextWorld.stepCount}`); 

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
                    console.log(`adding new object ${objId}`);
                    let localObj = this.gameEngine.world.objects[objId] = new Fighter(nextObj.id, nextObj.x, nextObj.y);
                    localObj.velX = nextObj.velX;
                    localObj.velY = nextObj.velY;
                    localObj.isPlayerControlled = (this.playerId == nextObj.id);
                }

                // update positions with interpolation
                // if the object is not self
                if (this.playerId != nextObj.id) {

                    var playPercentage = (stepToPlay - previousWorld.stepCount)/(nextWorld.stepCount - previousWorld.stepCount);

                    world.objects[objId].x = (nextObj.x - prevObj.x) * playPercentage + prevObj.x;
                    world.objects[objId].y = (nextObj.y - prevObj.y) * playPercentage + prevObj.y;
                }
            }
        }

        // step 2: destroy unneeded objects
        for (let objId in previousWorld.objects) {
            if (previousWorld.objects.hasOwnProperty(objId) && !nextWorld.objects.hasOwnProperty(objId)) {
                console.log(`destroying unneeded ${objId}`);
                world.objects[objId].destroy();
                delete world.objects[objId];
            }
        }

        // step 3: refresh physics for objects that survived
        for (let objId in world.objects) {
            console.log(`refreshing ${objId}`);
            if (world.objects.hasOwnProperty(objId)) {
                world.objects[objId].refreshPhysics(this.gameEngine.sumo3D);
            }
        }

    }

    processInputs(){
        if (this.touchData) {
            let input = { 
                touchX: event.changedTouches[0].clientX, 
                touchY:event.changedTouches[0].clientY 
            };
            console.log(`sending input to server ${input}`);
            this.sendInput(input);
        }
    }

}


module.exports = SumoClientEngine;
