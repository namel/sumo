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


// setup game servers
const SumoServerEngine = require(path.join(__dirname, 'src/SumoServerEngine.js'));
const SumoGameEngine = require(path.join(__dirname, 'src/SumoGameEngine.js'));
const gameEngine = new SumoGameEngine(true);
const serverEngine = new SumoServerEngine(io, gameEngine, { debug:{ /* serverSendLag: 600 */ } });


// start the game
serverEngine.start();
