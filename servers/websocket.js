const socketServer = require('ws').Server;

let model = require('../resources/model');

function createSocketServer(server) {
  const wss = new socketServer({
    server: server
  });

  console.info('WebSocket server started...');

  wss.on('connection', (ws, req) => {
    try {
      let parts = selectResource(req.url);

      console.info(parts);

      if (parts[0] && parts[1]) {
        model.links[parts[0]].resources[parts[1]].data = new Proxy(model.links[parts[0]].resources[parts[1]].data, {
          set: (arr, index, val) => {
            console.info(arr, index, val);
            // ws.send([arr, index, val]);
            ws.send('msg from ws server!');
            return true;
          }
        });
      }
    } catch (err) {
      console.info(`Unable to observe ${req.url} resource`);
    }
  });
}

function selectResource(pathname) {
  return (pathname.split('/')).shift();
}

module.exports = createSocketServer;