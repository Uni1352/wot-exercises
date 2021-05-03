var httpServer = require('./servers/http');
var resources = require('./resources/model');
var pirPlugin = require('./plugins/internal/pirPlugin');
var dht22Plugin = require('./plugins/internal/dht22Plugin');
var ledsPlugin = require('./plugins/internal/ledsPlugin');

var server;

// pirPlugin.start({
//   'simulate': true,
//   'frequency': 3000
// });
// dht22Plugin.start({
//   'simulate': true,
//   'frequency': 3000
// });
ledsPlugin.start({
  'simulate': false,
  'frequency': 10000
})

server = httpServer.listen(resources.pi.port, () => {
  console.info('HTTP server started...');
  // wsServer.listen(server);
  console.info(`Your WoT Pi is up and running on port ${resources.pi.port}`);
});