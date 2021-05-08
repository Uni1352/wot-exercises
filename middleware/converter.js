var msgpack = require('msgpack5')();
var json2html = require('node-json2html');
var jsonld = require('../resources/piJsonLd.json');

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
        var helpers = {
          json: function (object) {
            return JSON.stringify(object);
          },
          getById: function (object, id) {
            return object[id];
          }
        };

        if (req.type) res.render(req.type, {
          req: req,
          helpers: helpers
        });
        else res.render('default', {
          req: req,
          helpers: helpers
        });
        return;
      }

      if (req.accepts('application/x-msgpack')) {
        console.info('MessagePack representation selected!');
        res.type('application/x-msgpack');
        res.send(encode(req.result));
        return;
      }

      if (req.accepts('application/ld+json')) {
        console.info('JSON-ld representation selected!');
        res.send(jsonld);
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