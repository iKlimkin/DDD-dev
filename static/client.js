'use strict';

// connect to debugger server
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
    create: null,
    read: null,
    update: null,
    delete: null,
    find: null,
  },
  country: {
    create: null,
    read: null,
    find: null,
  },
  city: {
    create: null,
    read: null,
    find: null,
  },
});

socket.onopen = async (event) => {
  console.log('api', api);
  console.log('event', event);
  console.log('WebSocket connected');
  // await api.user.read();
};
