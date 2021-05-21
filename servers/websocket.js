const socketServer = require('ws').Server;
const model = require('../resources/model');

function createSocketServer(server) {
  const wss = new socketServer({
    server: server
  });

  console.info('WebSocket server started...');

  wss.on('connection', (ws, req) => {
    const pathname = req.url;

    try {
      let resourceData = selectResource(pathname);

      createProxy(resourceData);
    } catch (err) {
      console.info(`Unable to observe ${req.url} resource`);
    }
  });
}

function createProxy(target) {
  console.info(target);

  target = new Proxy(target, {
    set: (arr, index, val) => {
      console.info(arr, index, val);
      // ws.send([arr, index, val]);
      ws.send('msg from ws server!')
    }
  });

}

function selectResource(pathname) {
  let parts = pathname.split('/');

  parts.shift();

  if (parts[0] === 'actions')
    return model.links.actions.resources[parts[1]].data;
  else if (parts[0] === 'properties')
    return model.links.properties.resources[parts[1]].data;
  else return;
}

module.exports = createSocketServer;