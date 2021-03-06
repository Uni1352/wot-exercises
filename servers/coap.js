const coap = require('coap');
const getRandomNumber = require('../utils/utils').getRandomNum;

const port = 5683;

function respond(res, content) {
  if (content) {
    res.setOption('Content-Format', 'application/json');
    res.code = '2.05';
    res.end(JSON.stringify(content));
  } else {
    res.code = '4.04';
    res.end();
  }
}

coap
  .createServer((req, res) => {
    console.info(`CoAP device got a request for ${req.url}`);

    if (req.headers(['Accept']) != 'application/json') {
      res.code = '4.06';
      return res.end();
    }

    switch (req.url) {
      case '/co2':
        respond(res, {
          'co2': getRandomNumber(0, 1000)
        });
        break;
      case '/temp':
        respond(res, {
          'temp': getRandomNumber(0, 40)
        });
        break;
      default:
        respond(res);
    }
  })
  .listen(port, () => console.info(`CoAP server started on port ${port}`));