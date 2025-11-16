'use strict';

const receiveArgs = async (req) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();
  if (!data) return null;
  return JSON.parse(data);
};

module.exports = receiveArgs;
