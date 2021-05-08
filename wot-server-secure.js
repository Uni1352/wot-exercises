var fs = require('fs');

var httpServer = require('./servers/http');
var wsServer = require('./servers/websockets');
var resources = require('./resources/model');

var pirPlugin;
var dht22Plugin;
var ledsPlugin;

function createWoTServer(port, secure) {
  if (process.env.PORT) port = process.env.PORT;
  else if (port === undefined) port = resources.customFields.port;

  if (secure === undefined) secure = resources.customFields.secure;

  initPlugins();

  if (secure) {
    return createServerThroughHTTPS(port);
  } else {
    return createServerThroughHTTP(port);
  }
}



function createServerThroughHTTP(port) {
  var http = require('http');
  var server = http.createServer(httpServer).listen(process.env.PORT | port, () => {
    wsServer.listen(server);
    console.log(`Unsecure server started on port ${port}`);
  });

  return server;
}

function createServerThroughHTTPS(port) {
  var https = require('https');
  var config = {
    cert: fs.readFileSync('./resources/change_me_caCert.pem'),
    key: fs.readFileSync('./resources/change_me_privateKey.pem'),
    passphrase: 'webofthings'
  }
  var server = https.createServer(config, httpServer).listen(port, () => {
    wsServer.listen(server);
    console.log(`Secure WoT server started on port ${port}`);
  });

  return server;
}

function initPlugins() {
  var PirPlugin = require('./plugins/internal/pirPlugin');
  var Dht22Plugin = require('./plugins/internal/dht22Plugin');
  var LedsPlugin = require('./plugins/internal/ledsPlugin');

  pirPlugin = new PirPlugin({
    'simulate': true,
    'frequency': 3000
  });
  pirPlugin.start();

  dht22Plugin = new Dht22Plugin({
    'simulate': true,
    'frequency': 3000
  });
  dht22Plugin.start();

  ledsPlugin = new LedsPlugin({
    'simulate': true,
    'frequency': 3000
  });
  ledsPlugin.start();
}

process.on('SIGINT', () => {
  pirPlugin.stop();
  ledsPlugin.stop();
  dht22Plugin.stop();
  console.log('BYE');
  process.exit();
});

module.exports = createWoTServer;