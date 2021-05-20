const msgpack = require('msgpack5')();
const msgpackEncoder = msgpack.encode;

function generateRepresentationForm(req, res, next) {
  console.info('Representation Converter Middleware Called!');

  if (req.result) {
    switch (req.accepts(['json', 'application/x-msgpack'])) {
      case 'json':
        console.info('JSON Representation Selected!');
        res.send(req.result);
        break;
      case 'application/x-msgpack':
        console.info('MessagePack Representation Selected!');
        res.type('application/x-msgpack');
        res.send(msgpackEncoder(req.result));
        break;
      default:
        console.info('Defaulting to JSON Representation!');
        res.send(req.result);
    }
  }
}

module.exports = {
  representationConverter: () => generateRepresentationForm
}