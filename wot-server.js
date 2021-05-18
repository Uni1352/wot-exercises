const model = require('./resources/model');
const httpServer = require('./servers/http');

function initPlugins() {
  const PirPlugin = require('./plugins/internal/pirPlugin');

  pirPlugin = new PirPlugin({
    'simulate': true,
    'frequency': 3000
  });
  pirPlugin.startPlugin();
}

function createServer(port, secure) {
  const http = require('http');

  if (port === undefined) port = model.customFields.port;

  initPlugins();

  if (!secure) const server = http.createServer(httpServer).listen(port, () => {
    console.info(`Your WoT Pi is up and running on port ${port}`);
  });

  return server;
}

module.exports = createServer;