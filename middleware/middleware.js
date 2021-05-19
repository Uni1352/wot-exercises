const msgpack = require('msgpack5')();

const jsonld = require('../resources/piJsonLd.json');

const msgpackEncoder = msgpack.encode;

function generateRepresentationForm(req, res, next) {
  console.info('Representation Converter Middleware Called!');

  if (req.result) {
    switch (req.accepts(['json', 'html', 'application/ld+json', 'application/x-msgpack'])) {
      case 'json':
        console.info('JSON Representation Selected!');
        res.send(req.result);
        break;
      case 'html':
        let helpers = {
          json: (obj) => JSON.stringify(obj),
          getById: (obj, id) => obj[id]
        }

        if (req.type) res.render(req.type, {
          req: req,
          helpers: helpers
        });
        else res.render('default', {
          req: req,
          helpers: helpers
        });
        break;
      case 'application/ld+json':
        console.info('JSON-LD Representation Selected!');
        res.send(jsonld);
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
    return;
  } else {
    next();
  }
}

module.exports = {
  representationConverter: () => generateRepresentationForm
}