'use strict';

const { Server } = require('ws');

const wsServer = (routing, port) => {
  const wss = new Server({ port }, () => {
    console.log(`WebSocket server is running on port ${port}`);
  });

  wss.on('connection', (connection, req) => {
    const ip = req.socket.remoteAddress;
    connection.on('message', async (message) => {
      const obj = JSON.parse(message);
      const { name, method, args = [] } = obj;
      const entity = routing[name];
      if (!entity) {
        return connection.send(JSON.stringify({ error: 'Not found' }), {
          binary: false,
        });
      }
      const handler = entity[method];
      if (!handler) {
        return connection.send(JSON.stringify({ error: 'Method not found' }), {
          binary: false,
        });
      }
      const json = JSON.stringify(args);
      const params = json.slice(1, json.length - 1);
      console.log(`${ip} - ${name}.${method}(${params})`);
      try {
        const result = await handler.apply(entity, args);
        connection.send(JSON.stringify(result), { binary: false });
      } catch (error) {
        console.error(error);
        connection.send(JSON.stringify({ error: 'Server error' }), {
          binary: false,
        });
      }
    });
  });
};

module.exports = wsServer;
