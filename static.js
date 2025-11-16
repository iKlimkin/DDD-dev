'use strict';

const http = require('node:http');
const path = require('node:path');
const fsp = require('node:fs/promises');

module.exports = (root, port) => {
  http
    .createServer(async (req, res) => {
      let url = req.url === '/' ? '/index.html' : req.url;

      if (url.startsWith('/')) {
        url = url.slice(1);
      }
      const filePath = path.join(root, url);

      if (url.includes('.well-known') || url.includes('favicon.ico')) {
        res.statusCode = 404;
        return res.end();
      }

      try {
        const data = await fsp.readFile(filePath);

        if (url.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
        } else if (url.endsWith('.html')) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
        } else if (url.endsWith('.svg')) {
          res.setHeader('Content-Type', 'image/svg+xml');
        } else if (url.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
        } else if (url.endsWith('.json')) {
          res.setHeader('Content-Type', 'application/json');
        }

        res.end(data);
      } catch (error) {
        console.error(error);
        if (!url.includes('.well-known') && !url.includes('favicon')) {
          console.error(`404: ${url}`);
        }
        res.statusCode = 404;
        res.end('"File is not found"');
      }
    })
    .listen(port, () => {
      console.log(`Static on port ${port}`);
    });
};
