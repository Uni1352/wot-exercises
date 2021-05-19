const socketServer = require('ws').Server;

const model = require('../resources/model');

function createSocketServer(server) {
  const wss = new socketServer({
    server: server
  });

  console.info('WebSocket server started...');

  wss.on('connection', (ws, req) => {
    let urlWrapper = {
      url: req.url
    };

    console.info(typeof urlWrapper);
    console.info(urlWrapper);

    try {
      new Proxy(urlWrapper, {
        set: (target, prop, val) => {
          if (prop === 'url') ws.send(val);
        }
      })
    } catch (err) {
      console.info(`Unable to observe ${url} resource`)
    }
  });
}

module.exports = createSocketServer;