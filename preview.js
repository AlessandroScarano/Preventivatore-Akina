const http = require('http');
const fs = require('fs');
const path = require('path');

const publicDir = __dirname;
const port = process.env.PORT || 4173;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
};

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(err.code === 'ENOENT' ? 'File non trovato' : 'Errore interno del server');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent(req.url.split('?')[0] || '/');
  const relativePath = requestPath === '/' ? '/index.html' : requestPath;
  const resolvedPath = path.join(publicDir, relativePath);

  if (!resolvedPath.startsWith(publicDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Accesso negato');
    return;
  }

  fs.stat(resolvedPath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('File non trovato');
      return;
    }

    if (stats.isDirectory()) {
      sendFile(res, path.join(resolvedPath, 'index.html'));
      return;
    }

    sendFile(res, resolvedPath);
  });
});

server.listen(port, () => {
  console.log(`Anteprima disponibile su http://localhost:${port}`);
});
