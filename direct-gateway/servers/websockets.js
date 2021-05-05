var webSocket = require('ws');
var resources = require('../resources/model');
var webSocketServer = webSocket.Server;

function selectResource(url) {
  var parts = url.spilt('/');
  var result = resources;

  parts.shift();
  for (var i = 0; i < parts.length; i++) {
    result = result[parts[i]];
  }
  return result;
}

exports.listen = (server) => {
  var wss = new webSocketServer({
    server: server
  });

  console.info('WebSocket server started...');
  wss.on('connection', (ws) => {
    var url = ws.upgradeReq.url;

    console.info(url);
    try {
      Object.observe(selectResource(url), (changes) => {
        ws.send(JSON.stringify(changes[0].object), () => {});
      });
    } catch (e) {
      console.log(`Unable to observer ${url} resource!`);
    }
  });
}