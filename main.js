'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

// Constants
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, './index.html');

// define routes and socket
const server = express();
server.get('/', (req, res) => { res.sendFile(INDEX); });
server.use('/', express.static(path.join(__dirname, '.')));
const requestHandler = server.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = socketIO(requestHandler);

// get game classes
const SumoServerEngine = require('./src/server/SumoServerEngine.js');
const SumoGameEngine = require('./src/common/SumoGameEngine.js');
const CannonPhysicsEngine = require('incheon').physics.CannonPhysicsEngine;

// create instances
const physicsEngine = new CannonPhysicsEngine();
const gameEngine = new SumoGameEngine({ physicsEngine, traceLevel: 0 });
const serverEngine = new SumoServerEngine(io, gameEngine, { debug: {}, updateRate: 6 });


// start the game
serverEngine.start();
