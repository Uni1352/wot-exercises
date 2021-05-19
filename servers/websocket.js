const socketServer = require('ws').Server;
const url = require('url');

const model = require('../resources/model');

function createSocketServer(server) {
  const wss = new socketServer({
    server: server
  });

  console.info('WebSocket server started...');

  wss.on('connection', (ws) => {
    // try {
    //   new Proxy(selectResource(req.url), {
    //     set: (target, prop, val) => {
    //       ws.send('test');
    //     }
    //   });
    // } catch (err) {
    //   console.info(`Unable to observe ${url} resource`);
    // }
    try {
      Array.observe(selectResource(ws.upgradeReq.url), function (changes) { //#C
        ws.send(JSON.stringify(changes[0].object[changes[0].object.length - 1]), function () {});
      }, ['add'])
    } catch (e) { //#D
      console.log('Unable to observe %s resource!', url);
    }

  });
}

function selectResource(url) {
  let parts = url.split('/');
  let result;

  parts.shift();

  if (parts[0] === 'actions') {
    result = model.links.actions.resources[parts[1]].data;
  } else {
    result = model.links.properties.resources[parts[1]].data;
  }
  return result;
}

module.exports = createSocketServer;