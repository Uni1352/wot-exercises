const url = `wss://ws.evrythng.com:443/thngs/${thngId}/properties?access_token=${key}`;
const socket = new WebSocket(url);

socket.onmessage = (message) => {
  const content = JSON.parse(message);

  console.log(`Property Update: ${content[0]}`);
  $(`#value-${content[0].key}`).html(content[0].value);
};

socket.onerror = (error) => {
  console.log(`Error ocurred: ${error}`);
};