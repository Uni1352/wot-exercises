const socketServer = require('ws').Server;

let model = require('../resources/model');

function createSocketServer(server) {
  const wss = new socketServer({
    server: server
  });

  console.info('WebSocket server started...');

  wss.on('connection', (ws, req) => {
    try {
      let parts = getPathnameParts(req.url);

      if (parts[0] && parts[1]) {
        createProxy(model.links[parts[0]].resources[parts[1]].data);
        // model.links[parts[0]].resources[parts[1]].data = new Proxy(model.links[parts[0]].resources[parts[1]].data, {
        //   set: (arr, index, val) => {
        //     if (!isNaN(parseInt(index))) {
        //       arr[index] = val;
        //       ws.send(JSON.stringify(val));
        //     }
        //     return true;
        //   }
        // });
      }
    } catch (err) {
      console.info(`Unable to observe ${req.url} resource`);
    }
  });
}

function createProxy(target) {
  target = new Proxy(target, {
    set: (arr, index, val) => {
      if (!isNaN(parseInt(index))) {
        arr[index] = val;
        ws.send(JSON.stringify(val));
      }
      return true;
    }
  })
}

function getPathnameParts(pathname) {
  let parts = pathname.split('/');
  parts.shift();
  return parts;
}

module.exports = createSocketServer;