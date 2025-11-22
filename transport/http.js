'use strict';

const http = require('node:http');
const bodyParser = require('../body.js');

const HEADERS = {
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=UTF-8',
};

module.exports = (routing, port, console) => {
  http
    .createServer(async (req, res) => {
      res.writeHead(200, HEADERS);
      if (req.method !== 'POST') return void res.end('Not found');
      const { url, socket } = req;
      const [place, name, method] = url.slice(1).split('/');
      if (place !== 'api') return void res.end('Not found');
      const entity = routing[name];
      if (!entity) return void res.end('Not found');
      const handler = entity[method];
      if (!handler) return void res.end('Method not allowed');
      const args = [];
      const body = await bodyParser(req);
      const src = handler.toString();
      const signature = src.slice(0, src.indexOf(')'));
      if (signature.includes('(id')) args.push(body.id);
      if (signature.includes('{')) args.push(body);
      console.log(`${socket.remoteAddress} - ${name}.${method}(${args})`);
      const result = await handler.apply(entity, args);
      res.end(JSON.stringify(result));
    })
    .listen(port, () => {
      console.system(`Server is running on port ${port}`);
    });
};
