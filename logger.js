'use strict';

const fs = require('node:fs');
const util = require('node:util');
const path = require('node:path');

const COLORS = {
  info: '\x1b[1;37m',
  debug: '\x1b[1;33m',
  error: '\x1b[0;31m',
  system: '\x1b[1;34m',
  access: '\x1b[1;38m',
};

const DATETIME_LENGTH = 19;

class Logger {
  constructor(logPath) {
    this.path = logPath;
    const date = new Date().toISOString().slice(0, 10);
    const filePath = path.join(logPath, `${date}.log`);
    this.stream = fs.createWriteStream(filePath, { flags: 'a' });
    this.regexp = new RegExp(path.dirname(logPath), 'g');
  }

  close() {
    return new Promise((resolve) => this.stream.end(resolve));
  }

  #write(type = 'info', message) {
    const now = new Date().toISOString();
    const date = now.slice(0, DATETIME_LENGTH);
    const color = COLORS[type];
    const line = `${date}\t${message}`;
    console.log(color + line + '\x1b[0m');
    const out = line.replace(/[\n\r]\s*/g, '; ') + '\n';
    this.stream.write(out);
  }

  log(...args) {
    const message = util.format(...args);
    this.#write('info', message);
  }

  dir(...args) {
    const message = util.format(...args);
    this.#write('info', message);
  }

  debug(...args) {
    const message = util.format(...args);
    this.#write('debug', message);
  }

  error(...args) {
    const message = util.format(...args);
    this.#write('error', message);
  }

  system(...args) {
    const message = util.format(...args);
    this.#write('system', message);
  }

  access(...args) {
    const message = util.format(...args);
    this.#write('access', message);
  }
}

module.exports = (path = './log') => new Logger(path);
