const socketServer = require('ws').Server;

let model = require('../resources/model');

function createSocketServer(server) {
  const wss = new socketServer({
    server: server
  });

  console.info('WebSocket server started...');

  wss.on('connection', (ws, req) => {
    try {
      let parts = getPathnameParts(req.url.split('/'));

      console.info(parts);

      if (parts[0] && parts[1]) {
        model.links[parts[0]].resources[parts[1]].data = new Proxy(model.links[parts[0]].resources[parts[1]].data, {
          set: (arr, index, val) => {
            if (!isNaN(parseInt(index))) {
              console.info(arr, index, val);
              arr[index] = val;
              ws.send(`Get PIR Value: ${val.presence}`);
            }
            return true;
          }
        });
      }
    } catch (err) {
      console.info(`Unable to observe ${req.url} resource`);
    }
  });
}

function getPathnameParts(pathname) {
  return pathname.shift();
}

module.exports = createSocketServer;