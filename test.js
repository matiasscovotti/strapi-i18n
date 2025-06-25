const assert = require('assert');
const http = require('http');
const fs = require('fs');
const path = require('path');
const createServer = require('./server');

const localesDir = path.join(__dirname, 'src', 'app', 'i18n', 'locales');
const testFile = path.join(localesDir, 'test.json');
fs.writeFileSync(testFile, JSON.stringify({ hello: 'Hola' }, null, 2));

const server = createServer({ localesDir });
server.listen(0, () => {
  const { port } = server.address();

  // GET request
  http.get({ hostname: 'localhost', port, path: '/i18n-json/test' }, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      assert.strictEqual(res.statusCode, 200);
      const json = JSON.parse(data);
      assert.strictEqual(json.hello, 'Hola');

      // POST request
      const postData = JSON.stringify({ hello: 'Adios' });
      const req = http.request({ hostname: 'localhost', port, path: '/i18n-json/test', method: 'POST', headers: {'Content-Type': 'application/json'} }, res2 => {
        res2.on('data', () => {});
        res2.on('end', () => {
          assert.strictEqual(res2.statusCode, 200);
          const saved = JSON.parse(fs.readFileSync(testFile));
          assert.strictEqual(saved.hello, 'Adios');
          fs.unlinkSync(testFile);
          server.close(() => { console.log('Tests passed'); });
        });
      });
      req.write(postData);
      req.end();
    });
  });
});
