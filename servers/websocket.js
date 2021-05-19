const socketServer = require('ws').Server;

const model = require('../resources/model');

function createSocketServer(server) {
  const wss = new socketServer({
    server: server
  });

  console.info('WebSocket server started...');

  wss.on('connection', (ws, req) => {
    try {
      new Proxy(selectResource(req.url), {
        set: (target) => ws.send(JSON.stringify(target[0]))
      });
    } catch (err) {
      console.info(`Unable to observe ${req.url} resource`);
    }
  });
}

function selectResource(url) {
  let parts = url.split('/');
  let result;

  parts.shift();

  if (parts[0] === 'actions') {
    result = model.links.actions.resources[parts[1]].data;
  } else {
    result = model.links.properties.resources[parts[1]].data;
  }
  return result;
}

module.exports = createSocketServer;