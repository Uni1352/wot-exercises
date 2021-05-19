const socketServer = require('ws').Server;
const url = require('url');

const model = require('../resources/model');

function createSocketServer(server) {
  const wss = new socketServer({
    server: server
  });

  console.info('WebSocket server started...');

  wss.on('connection', (ws, req) => {
    const url = req.url;
    console.info(selectResource(req.url));

    try {
      // new Proxy(selectResource(url), {
      //   set: (target, prop, val) => {
      //     console.info(target);
      //     console.info(prop);
      //     console.info(val);
      //   }
      // });
      ws.send(req.url);
    } catch (err) {
      console.info(`Unable to observe ${url} resource`);
    }
  });
}

function selectResource(url) {
  let parts = url.split('/');
  let result;

  parts.shift();
  console.info(parts);

  switch (parts[0]) {
    case 'properties':
      result = model.links.properties.resources[parts[1]].data;
      break;
    case 'actions':
      result = model.links.actions.resources[parts[1]].data;
  }

  return result;
}

module.exports = createSocketServer;