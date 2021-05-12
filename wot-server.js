const model = require('./resources/model');
const httpServer = require('./servers/http');
const pirPlugin = require('./plugins/internal/pirPlugin');
const dht22Plugin = require('./plugins/internal/dht22Plugin');
const ledPlugin = require('./plugins/internal/ledPlugin');

const port = model.pi.port;

let server;

pirPlugin.startPlugin({
  'simulate': true,
  'frequency': 3000
});

dht22Plugin.startPlugin({
  'simulate': true,
  'frequency': 3000
});

ledPlugin.startPlugin({
  'simulate': true,
  'frequency': 3000
});

server = httpServer.listen(port, () => {
  console.info(`Your WoT Pi is up and running on port ${port}`);
});