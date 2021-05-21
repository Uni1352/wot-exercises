const socketServer = require('ws').Server;
const model = require('../resources/model');

function createSocketServer(server) {
  const wss = new socketServer({
    server: server
  });

  console.info('WebSocket server started...');

  wss.on('connection', (ws, req) => {
    try {
      let parts = selectResource(req.url).shift();

      console.info(parts);
      if (parts[0] && parts[1]) {
        let resourceData = model.links[parts[0]].resources[parts[1]].data;

        resourceData = new Proxy(resourceData, {
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
  return pathname.split('/');


  // if (parts[0] === 'actions')
  //   return model.links.actions.resources[parts[1]].data;
  // else if (parts[0] === 'properties')
  //   return model.links.properties.resources[parts[1]].data;
  // else return;
}

module.exports = createSocketServer;