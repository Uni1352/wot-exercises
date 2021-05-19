const socketServer = require('ws').Server;

const model = require('../resources/model');

function createSocketServer(server) {
  const wss = new socketServer({
    server: server
  });

  console.info('WebSocket server started...');

  wss.on('connection', (ws) => {
    const url = ws.upgradeReq.url;

    console.info(url);
  });
}

module.exports = createSocketServer;