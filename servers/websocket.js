const socketServer = require('ws').Server;

const model = require('../resources/model');

function createSocketServer(server) {
  const wss = new socketServer({
    server: server
  });

  console.info('WebSocket server started...');

  wss.on('connection', (ws, req) => {
    const reqUrl = req.socket.remoteAddress;

    console.info(reqUrl);
  });
}

module.exports = createSocketServer;