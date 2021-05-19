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
    console.info(selectResource(url), typeof selectResource(url));

    try {
      // new Proxy(selectResource(url), {
      //   set: (target, prop, val) => {
      //     console.info(target);
      //     console.info(prop);
      //     console.info(val);
      //   }
      // });
    } catch (err) {
      console.info(`Unable to observe ${url} resource`);
    }
  });
}

function selectResource(url) {
  const parts = url.spilt('/').shift();

  console.info(parts);

  switch (parts[0]) {
    case 'properties':
      return model.links.properties.resources[parts[1]].data;
    case 'actions':
      return model.links.actions.resources[parts[1]].data;
  }
}

module.exports = createSocketServer;