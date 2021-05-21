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

      if (parts[0] && parts[1]) {
        let resources = model.links[parts[0]].resource;

        resources[parts[1]].data = new Proxy(resources[parts[1]].data, {
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

function createProxy(target) {
  target = new Proxy(target, {
    set: (arr, index, val) => {
      console.info(arr, index, val);
      // ws.send([arr, index, val]);
      ws.send('msg from ws server!');
      return true;
    }
  });
}

function selectResource(pathname) {
  let parts = pathname.split('/');

  parts.shift();

  return parts;



  // if (parts[0] === 'actions')
  //   return model.links.actions.resources[parts[1]].data;
  // else if (parts[0] === 'properties')
  //   return model.links.properties.resources[parts[1]].data;
  // else return;
}

module.exports = createSocketServer;