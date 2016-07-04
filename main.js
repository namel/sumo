'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');


// Constants
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, './index.html');
const server = express();


// Index.html
server.get('/', function (req, res) { res.sendFile(INDEX) });
server.use('/', express.static(path.join(__dirname, '.')));


// setup server
var requestHandler = server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = socketIO(requestHandler);


// get game classes
const ServerEngine = require('incheon').ServerEngine;
const SumoGameEngine = require(path.join(__dirname, 'src/SumoGameEngine.js'));
const SumoPhysicsEngine = require(path.join(__dirname, 'src/SumoPhysicsEngine.js'));

// create instances
const physicsEngine = new SumoPhysicsEngine();
const gameEngine = new SumoGameEngine({ isServer:true, physicsEngine:physicsEngine });
const serverEngine = new ServerEngine(io, gameEngine, {});


// start the game
serverEngine.start();
