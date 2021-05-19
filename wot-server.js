const model = require('./resources/model');
const httpServer = require('./servers/http');

function createServer(port, secure) {
  let server;

  if (port === undefined) port = model.customFields.port;

  if (!secure) server = httpServer.listen(port, () => {
    console.info('HTTP server started...');
    console.info(`Your WoT Pi server is up and running on port ${port}`);
  });

  return server;
}

process.on('SIGINT', () => {
  console.info('BYE!');
  process.exit();
});

module.exports = createServer;