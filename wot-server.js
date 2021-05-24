const httpServer = require('./servers/http');
const wsServer = require('./servers/websocket');

let model = require('./resources/model');
let pirPlugin, ledsPlugin;


function createServer(port, secure) {
  let server;

  initPlugins();

  if (port === undefined) port = model.customFields.port;

  if (!secure) server = httpServer.listen(port, () => {
    console.info('[Server] HTTP server started...');
    wsServer(server);
    console.info(`[Server] Your WoT Pi server is up and running on port ${port}`);
  });

  return server;
}

function initPlugins() {
  const PirPlugin = require('./plugins/internal/pirPlugin');
  const LedPlugin = require('./plugins/internal/ledPlugin');

  pirPlugin = new PirPlugin({
    'simulate': false,
    'frequency': 2000
  });
  pirPlugin.startPlugin();

  ledsPlugin = new LedPlugin({
    'simulate': false,
    'frequency': 2000
  });
  ledsPlugin.startPlugin();
}

process.on('SIGINT', () => {
  pirPlugin.stopPlugin();
  ledsPlugin.stopPlugin();
  console.info('BYE!');
  process.exit();
});

module.exports = createServer;