'use strict';

const console = require('./logger.js');
const http = require('node:http');
const bodyParser = require('./body.js');

const crud = {
  get: 'read',
  post: 'create',
  put: 'update',
  delete: 'delete',
};

const server = (routing, port) => {
  http
    .createServer(async (req, res) => {
      const { method, url, socket } = req;
      console.log(`${socket.remoteAddress} - ${method} ${url}`);
      const [path, id] = url.slice(1).split('/');
      const entity = routing[path];
      if (!entity) return void res.end('Not found');
      const procedure = crud[method.toLowerCase()];
      const handler = entity[procedure];
      if (!handler) return void res.end('Method not allowed');
      const args = [];
      const src = handler.toString();
      const signature = src.slice(0, src.indexOf(')'));
      if (signature.includes('(id')) args.push(id);
      if (signature.includes('{')) args.push(await bodyParser(req));
      const result = await handler.apply(entity, args);
      res.end(JSON.stringify(result));
    })
    .listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
};

module.exports = server;
