'use strict';

const transport = {};

const http = (url) => async (structure) => {
  const api = {};
  const services = Object.keys(structure);
  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      api[serviceName][methodName] = (...args) => {
        const fields = structure[serviceName][methodName];
        const body = fields.reduce(
          (acc, field, i) => ({ ...acc, [field]: args[i] }),
          {},
        );
        return new Promise((resolve, reject) => {
          fetch(`${url}/api/${serviceName}/${methodName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          }).then((response) => {
            if (response.status === 200) resolve(response.json());
            else reject(new Error(`Status code: ${response.status}`));
          });
        });
      };
    }
  }
  return api;
};

const ws = (url) => async (structure) => {
  const socket = new WebSocket(url);
  const api = {};
  const services = Object.keys(structure);
  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      api[serviceName][methodName] = (...args) =>
        new Promise((resolve) => {
          const fields = structure[serviceName][methodName];
          const payload = fields?.reduce(
            (acc, field, i) => ({ ...acc, [field]: args[i] }),
            {},
          );
          const packet = {
            name: serviceName,
            method: methodName,
            args: [payload],
          };
          socket.send(JSON.stringify(packet));
          socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            resolve(data);
          };
        });
    }
  }
  return new Promise((resolve) => {
    socket.addEventListener('open', () => resolve(api));
  });
};

Object.assign(transport, { http, ws });

const scaffold = (url) => {
  const protocol = url.startsWith('ws:') ? 'ws' : 'http';
  return transport[protocol](url);
};

const main = async () => {
  const structure = {
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
    health: {
      check: ['message'],
    },
  };
  const urls = {
    ws: 'ws://127.0.0.1:8001/',
    http: 'http://localhost:8001/',
  };
  const api = await scaffold(urls.ws)(structure);
  const data = await api.health.check('Health check');
  console.log('Running status: ', data.status);
};
main();
