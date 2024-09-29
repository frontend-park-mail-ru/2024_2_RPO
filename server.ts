import express from 'express';
import fs from 'fs';
import path from 'path';
import { compileTs } from './devServer/tsCompile';
import nocache from 'nocache';

console.log('Заводим сервак...');

const app = express();
app.use(nocache());

const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_METHOD_NOT_ALLOWED = 405;
const HTTP_STATUS_NOT_ACCEPTABLE = 406;
const HTTP_STATUS_INTERNAL_ERROR = 500;

const mimeTypeMap: any = {
  css: 'text/css',
  html: 'text/html',
  js: 'text/javascript',
  woff: 'font/woff',
  woff2: 'font/woff2',
  ttf: 'font/ttf',
  svg: 'image/svg+xml',
  png: 'image/png',
};

let serverConfig: any;
try {
  serverConfig = JSON.parse(fs.readFileSync('serverConfig.json', 'utf8'));
} catch {
  throw new Error(
    'You should provide serverConfig.json file to make server working, check README.md'
  );
}

const port = serverConfig.serverPort;

if (
  typeof serverConfig.serverPort !== 'number' ||
  typeof serverConfig.apiUrl !== 'string'
) {
  throw new Error('serverConfig.json should be valid, check README.md');
}

const devServer = (req: express.Request, res: express.Response) => {
  let name = req.url;
  if (name === '' || name === '/' || name === '/app' || name === 'app') {
    name = '/index.html';
  }
  if (name === 'apiUrl' || name === '/apiUrl') {
    res.send(serverConfig.apiUrl);
  }
  const method = req.method;
  console.log(`${method} ${name}`);
  if (method !== 'GET') {
    res.status(HTTP_STATUS_METHOD_NOT_ALLOWED).send();
    return;
  }
  if (name.endsWith('.ts') || name.endsWith('.tsx')) {
    // После компиляции все ts и tsx файлы становятся .js
    res.status(HTTP_STATUS_NOT_ACCEPTABLE);
    res.send();
    return;
  }

  const pathToBuild = path.join('build', name);
  const pathToFile: string = name.endsWith('.js')
    ? pathToBuild
    : path.join('src', name);

  console.log(`Read file: ${pathToFile}`);
  if (!fs.existsSync(pathToFile)) {
    res.status(HTTP_STATUS_NOT_FOUND).send();
    return;
  }
  if (fs.statSync(pathToFile).isDirectory()) {
    if (fs.existsSync(path.join(pathToBuild, '/index.js'))) {
      res.redirect(req.url + '/index.js');
      return;
    }
    res.status(HTTP_STATUS_NOT_FOUND).send();
    return;
  }
  let fileContent: Buffer;
  try {
    fileContent = fs.readFileSync(pathToFile);
  } catch {
    res.status(HTTP_STATUS_INTERNAL_ERROR).send();
    return;
  }

  const nameSplitted = name.split('.');
  const nameExtension = nameSplitted.at(-1);
  if (nameExtension !== undefined && mimeTypeMap[nameExtension] !== undefined) {
    res.type(mimeTypeMap[nameExtension]);
  }

  res.send(fileContent);
  return;
};

const result = compileTs();
if (result === false) {
  app.use('/', (req, res) => {
    res.type('text/html');
    res.send(fs.readFileSync('devServer/errorMessage.html', 'utf8'));
  });
} else {
  app.use('/', devServer);
}

app.listen(port, () => {
  console.log(`Сервак принимает запросы на http://localhost:${port}`);
});
