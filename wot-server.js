const fs = require('fs');
const mongoClient = require('mongodb').MongoClient;
const httpServer = require('./servers/http');
const wsServer = require('./servers/websocket');
const curd = require('./database/curd');

const url = 'mongodb://192.168.0.14:27017/wot'

let model = require('./resources/model');
let pirPlugin, ledsPlugin;


function createServer(port, secure) {
  let server;

  if (process.env.PORT) port = process.env.PORT;
  else if (port === undefined) port = model.customFields.port;
  if (secure === undefined) secure = model.customFields.secure;

  initPlugins();

  if (secure) {
    const https = require('https');
    const config = {
      cert: fs.readFileSync('./resources/caCert.pem'),
      key: fs.readFileSync('./resources/privateKey.pem'),
      passphrase: 'uni135219'
    }

    server = https.createServer(config, httpServer).listen(port, () => {
      wsServer(server);
      console.info(`[Info] Secured WoT server started on port ${port}`);
    });
  } else {
    const http = require('http');
    server = http.createServer(httpServer).listen(port, () => {
      wsServer(server);
      console.info(`[Info] Unsecured WoT server started on port ${port}`);
    });
  }

  mongoClient.connect(url, {
    useUnifiedTopology: true
  }, curd.connection);

  return server;
}

function initPlugins() {
  const PirPlugin = require('./plugins/internal/pirPlugin');
  const LedPlugin = require('./plugins/internal/ledPlugin');

  pirPlugin = new PirPlugin({
    'simulate': true,
    'frequency': 3000
  });
  pirPlugin.startPlugin();

  ledsPlugin = new LedPlugin({
    'simulate': true,
    'frequency': 5000
  });
  ledsPlugin.startPlugin();
}

process.on('SIGINT', () => {
  pirPlugin.stopPlugin();
  ledsPlugin.stopPlugin();
  console.info('[Server] WebSocket server closed.');
  console.info('[Server] HTTP server closed.');
  console.info('[Info] BYE!');
  process.exit();
});

module.exports = createServer;