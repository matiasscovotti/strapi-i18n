const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer(options = {}) {
  const localesDir = options.localesDir || path.join(__dirname, 'src', 'app', 'i18n', 'locales');
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const match = url.pathname.match(/^\/i18n-json\/(\w+)$/);
    if (!match) {
      res.writeHead(404);
      return res.end('Not Found');
    }

    const lang = match[1];
    const filePath = path.join(localesDir, `${lang}.json`);

    if (req.method === 'GET') {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(404);
          return res.end('File Not Found');
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
      });
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const json = JSON.parse(body);
          fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf8', err => {
            if (err) {
              res.writeHead(500);
              return res.end('Write Error');
            }
            res.writeHead(200);
            res.end('OK');
          });
        } catch (e) {
          res.writeHead(400);
          res.end('Invalid JSON');
        }
      });
    } else {
      res.writeHead(405);
      res.end('Method Not Allowed');
    }
  });

  return server;
}

if (require.main === module) {
  const port = process.env.PORT || 3000;
  const server = createServer();
  server.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });
}

module.exports = createServer;
