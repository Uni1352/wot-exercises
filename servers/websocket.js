const socketServer = require('ws').Server;

const model = require('../resources/model');

function createSocketServer(server) {
  const wss = new socketServer({
    server: server
  });

  console.info('WebSocket server started...');

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url);

    console.info(url);

    // try {
    //   new Proxy(url, {
    //     set: (target) => ws.send(target)
    //   })
    // } catch (err) {
    //   console.info(`Unable to observe ${url} resource`)
    // }
  });
}

module.exports = createSocketServer;