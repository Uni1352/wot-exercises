const socketServer = require('ws').Server;
const url = require('url');

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

    try {
      console.info(urlWrapper.url);
      new Proxy(urlWrapper, {
        set: (target, prop, val) => {
          console.info(target);
          console.info(val);
        }
      });

      urlWrapper.url = '/properties';
    } catch (err) {
      console.info(`Unable to observe ${url} resource`)
    }
  });
}

module.exports = createSocketServer;