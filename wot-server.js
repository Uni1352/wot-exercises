const httpServer = require('./servers/http');
const resources = require('./resources/model');
const pirPlugin = require('./plugins/internal/pirPlugin');
const dht22Plugin = require('./plugins/internal/dht22Plugin');
// const ledsPlugin = require('./plugins/internal/ledsPlugin');

pirPlugin.start({
  'simulate': true,
  'frequency': 3000
});

dht22Plugin.start({
  'simulate': false,
  'frequency': 3000
});

// ledsPlugin.start({
//   'simulate': false,
//   'frequency': 10000
// })


let server = httpServer.listen(resources.pi.port, () => {
  console.info('HTTP server started...');
  // wsServer.listen(server);
  console.info(`Your WoT Pi is up and running on port ${resources.pi.port}`);
});