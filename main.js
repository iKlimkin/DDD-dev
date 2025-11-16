'use strict';

const db = require('./db.js');
const server = require('./http.js');
const PORT = 8000;

const routing = {
  users: require('./user.js'),
  countries: db('countries'),
  cities: db('cities'),
  session: db('sessions'),
};

server(routing, PORT);
