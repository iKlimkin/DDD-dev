'use strict';

const db = require('./db.js');
// const server = require('./http.js');
const server = require('./ws.js');
const staticServer = require('./static.js');

const routing = {
  user: require('./user.js'),
  country: db('countries'),
  citiy: db('cities'),
  session: db('sessions'),
};

staticServer('./static', 8000);
server(routing, 8001);
