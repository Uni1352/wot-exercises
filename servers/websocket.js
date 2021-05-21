const socketServer = require('ws').Server;
const model = require('../resources/model');

function createSocketServer(server) {
  const wss = new socketServer({
    server: server
  });

  console.info('WebSocket server started...');

  wss.on('connection', (ws, req) => {
    const pathname = req.url;

    ws.send(pathname);
  });
}

function selectResource(pathname) {
  let parts = pathname.split('/');

  parts.shift();

  if (parts[0] === 'actions')
    return model.links.actions.resources[parts[1]].data;
  else if (parts[0] === 'properties')
    return model.links.product.resources[parts[1]].data;
  else return;
}

module.exports = createSocketServer;