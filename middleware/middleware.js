const msgpack = require('msgpack5')();
const msgpackEncoder = msgpack.encode;

function generateRepresentationForm(req, res, next) {
  console.info('[Info] Representation Converter Middleware Called!');

  if (req.result) {
    switch (req.accepts(['json', 'application/x-msgpack'])) {
      case 'json':
        console.info('[Info] JSON Representation Selected!');
        res.send(req.result);
        break;
      case 'application/x-msgpack':
        console.info('[Info] MessagePack Representation Selected!');
        res.type('application/x-msgpack');
        res.send(msgpackEncoder(req.result));
        break;
      default:
        console.info('[Info] Defaulting to JSON Representation!');
        res.send(req.result);
    }
  } else if (res.location) {
    res.status(204).send();
  } else {
    next();
  }
}

module.exports = {
  representationConverter: () => generateRepresentationForm
}