const model = require('./resources/model');
const httpServer = require('./servers/http');
const wsServer = require('./servers/websocket');

let pirPlugin, ledsPlugin;

function initPlugins() {
  const PirPlugin = require('./plugins/internal/pirPlugin');
  const LedPlugin = require('./plugins/internal/ledPlugin');

  pirPlugin = new PirPlugin({
    'simulate': false,
    'frequency': 5000
  });
  pirPlugin.startPlugin();

  ledsPlugin = new LedPlugin({
    'simulate': false,
    'frequency': 5000
  });
  ledsPlugin.startPlugin();
}

function createServer(port, secure) {
  const http = require('http');

  let server;

  if (port === undefined) port = model.customFields.port;

  initPlugins();

  if (!secure) server = http.createServer(httpServer).listen(port, () => {
    console.info('HTTP server started...');
    wsServer(server);
    console.info(`Your WoT Pi is up and running on port ${port}`);
  });

  return server;
}

process.on('SIGINT', () => {
  pirPlugin.stopPlugin();
  ledsPlugin.stopPlugin();
  console.log('Bye, bye!');
  process.exit();
});

module.exports = createServer;