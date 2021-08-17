const fs = require('fs');
const httpServer = require('./servers/http');
const wsServer = require('./servers/websocket');
const mqtt = require('./mqtt/mqtt');

let model = require('./resources/model');

module.exports = createServer;

function createServer(port, secure) {
  let server;

  if (process.env.PORT) port = process.env.PORT;
  else if (port === undefined) port = model.customFields.port;
  if (secure === undefined) secure = model.customFields.secure;

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

  mqtt.connectMQTTBroker();
  mqtt.subscribeTopic('/properties/pir');

  initPlugins();
}

function initPlugins() {
  const pirPlugin = require('./plugins/pirPlugin');
  const ledPlugin = require('./plugins/ledPlugin');

  pirPlugin.startPlugin();
  ledPlugin.startPlugin('simulate');
}

process.on('SIGINT', () => {
  mqtt.disconnectMQTTBroker();
  console.info('[Server] WebSocket server closed.');
  console.info('[Server] HTTP server closed.');
  console.info('[Info] BYE!');
  process.exit();
});