const Server = require('ws').Server;

let model = require('../resources/model');

function createSocketServer(server) {
  const wss = new Server({
    server: server
  });

  console.info('[Server] WebSocket server started...');

  wss.on('connection', (ws, req) => {
    try {
      let parts = getPathnameParts(req.url);

      if (parts[0] && parts[1]) {
        model.links[parts[0]].resources[parts[1]].data = new Proxy(model.links[parts[0]].resources[parts[1]].data, {
          set: (arr, index, val) => {
            if (!isNaN(parseInt(index))) {
              arr[index] = val;
              ws.send(JSON.stringify(val));
            }
            return true;
          }
        });
      }
    } catch (err) {
      console.info(`[Error] Unable to observe ${req.url} resource.`);
    }
  });
}

function getPathnameParts(pathname) {
  let parts = pathname.split('/');
  parts.shift();
  return parts;
}

module.exports = createSocketServer;