const Server = require('ws').Server;
const { gql } = require('@apollo/client');

const client = require('../db/client/client');
let model = require('../resources/model');

function createSocketServer(server) {
  const wss = new Server({
    server: server
  });

  console.info('[Server] WebSocket server started...');

  wss.on('connection', async (ws, req) => {
    try {
      let parts = getPathnameParts(req.url);

      switch (parts[0]) {
        case 'properties':
          switch (parts[1]) {
            case 'pir':
              await client
                .subscribe({
                  query: gql(`subscription Subscription{
                    newPirValue{
                      presence
                      timestamp
                    }
                  }`),
                  variables: {}
                })
                .subscribe({
                  next: (data) => ws.send(JSON.stringify(data.data.newPirValue)),
                  error: (err) => console.info(`[Error] Error Occurred: ${err}`)
                });
              break;
            case 'leds':
              await client
                .subscribe({
                  query: gql(`subscription Subscription{
                    newLedValue{
                      one
                      two
                      timestamp
                    }
                  }`),
                  variables: {}
                })
                .subscribe({
                  next: (data) => ws.send(JSON.stringify(data.data.newLedValue)),
                  error: (err) => console.info(`[Error] Error Occurred: ${err}`)
                });
          }
          break;
        case 'actions':
          switch (parts[1]) {
            case 'ledState':
              await client
                .subscribe({
                  query: gql(`subscription Subscription{
                    newLedStateAction{
                      _id
                      status
                      ledId
                      state
                      timestamp
                    }
                  }`),
                  variables: {}
                })
                .subscribe({
                  next: (data) => ws.send(JSON.stringify(data.data.newLedStateAction)),
                  error: (err) => console.info(`[Error] Error Occurred: ${err}`)
                });
          }
          break;
      }

      // if (parts[0] && parts[1]) {
      //   model.links[parts[0]].resources[parts[1]].data = new Proxy(model.links[parts[0]]
      //     .resources[parts[1]].data, {
      //       set: (arr, index, val) => {
      //         if (!isNaN(parseInt(index))) {
      //           arr[index] = val;
      //           ws.send(JSON.stringify(val));
      //         }
      //         return true;
      //       }
      //     });
      // }
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