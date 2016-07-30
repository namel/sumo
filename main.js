'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const conf = require('./src/common/config');

// Constants
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, './index.html');
const server = express();

// command line arguments
let serverOptions = conf.serverConfig.interpolateMode;
if (process.argv > 1 && conf.serverConfig.hasOwnProperty(process.argv[1])) {
    serverOptions = conf.serverConfig[process.argv[1]];
}

// Index.html
server.get('/', (req, res) => { res.sendFile(INDEX); });
server.use('/', express.static(path.join(__dirname, '.')));

// setup server
const requestHandler = server.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = socketIO(requestHandler);

// get game classes
const ServerEngine = require('incheon').ServerEngine;
const SumoGameEngine = require('./src/common/SumoGameEngine.js');
const SumoPhysicsEngine = require('./src/common/SumoPhysicsEngine.js');

// create instances
const physicsEngine = new SumoPhysicsEngine();
const gameEngine = new SumoGameEngine({ isServer: true, physicsEngine });
const serverEngine = new ServerEngine(io, gameEngine, serverOptions);


// start the game
serverEngine.start();
