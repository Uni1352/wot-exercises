var msgpack = require('msgpack5')();
var json2html = require('node-json2html');

var encode = msgpack.encode;

module.exports = () => {
  return (req, res, next) => {
    console.info('Representation converter middleware called!');

    if (req.result) {
      if (req.accepts('json')) {
        console.info('JSON representation selected!');
        res.send(req.result);
        return;
      }

      if (req.accepts('html')) {
        console.info('HTML representation selected!');

        var transform = {
          'tag': 'div',
          'html': '${name} : ${value}'
        };

        res.send(json2html.transform(req.result, transform));
        return;
      }

      if (req.accepts('application/x-msgpack')) {
        console.info('MessagePack representation selected!');
        res.type('application/x-msgpack');
        res.send(encode(req.result));
        return;
      }

      console.info('Defaulting to JSON representation!');
      res.send(req.result);
      return;
    } else {
      next();
    }
  };
};