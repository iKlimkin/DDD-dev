'use strict';

const socket = new WebSocket('ws://127.0.0.1:8001/');

const scaffold = (structure) => {
  const api = {};
  const services = Object.keys(structure);
  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      api[serviceName][methodName] = (...args) =>
        new Promise((resolve) => {
          const packet = { name: serviceName, method: methodName, args };
          socket.send(JSON.stringify(packet));
          socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            resolve(data);
          };
        });
    }
  }
  return api;
};

const api = scaffold({
  user: {
    create: 1,
    read: 1,
    update: 1,
    delete: 1,
    find: 1,
  },
});

socket.addEventListener('open', async (event) => {
  console.log('event', event);
  console.log('api', api);
  const data = await api.user.read(1);
  console.log(data);
});
