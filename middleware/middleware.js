const msgpack = require('msgpack5');
const json2html = require('node-json2html');

const encode = msgpack.encode;

function generateRepresentationForm(req, res, next) {
  console.info('Representation Converter Middleware Called!');

  if (req.result) {
    switch (req.accepts) {
      case 'json':
        console.info('JSON Representation Selected!');
        res.send(req.result);
        break;
      case 'html':
        const transform = {
          'tag': 'div',
          'html': '${name}:${value}'
        };

        console.info('HTML Representation Selected!');
        res.send(json2html.transform(req.result, transform));
        break;
      case 'application/x-msgpack':
        console.info('MessagePack Representation Selected!');
        res.type('application/x-msgpack');
        res.send(encode(req.result));
        break;
      default:
        console.info('Defaulting to JSON Representation!');
        res.send(req.result);
    }
  } else {
    next();
  }
}

module.exports = () => {
  return (req, res, next) => {
    console.info('Representation Converter Middleware Called!');

    if (req.result) {
      switch (req.accepts(['json', 'html', 'application/x-msgpack'])) {
        case 'html':
          const transform = {
            'tag': 'div',
            'html': '${name}:${value}'
          };

          console.info('HTML Representation Selected!');
          res.send(json2html.transform(req.result, transform));
          break;
        case 'application/x-msgpack':
          console.info('MessagePack Representation Selected!');
          res.type('application/x-msgpack');
          res.send(encode(req.result));
          break;
        default:
          console.info('Defaulting to JSON Representation!');
          res.send(req.result);
      }
    } else {
      next();
    }
  }
};