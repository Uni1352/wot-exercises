const keys = require('../resources/auth.json');
const msgpack = require('msgpack5')();
const msgpackEncoder = msgpack.encode;

function generateRepresentationForm(req, res, next) {
  console.info('[Info] Representation Converter Middleware Called!');

  if (req.result) {
    switch (req.accepts(['json', 'html', 'application/x-msgpack'])) {
      case 'json':
        console.info('[Info] JSON Representation Selected!');
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
      case 'application/x-msgpack':
        console.info('[Info] MessagePack Representation Selected!');
        res.type('application/x-msgpack');
        res.send(msgpackEncoder(req.result));
        break;
      default:
        console.info('[Info] Defaulting to JSON Representation!');
        res.send(req.result);
    }
    return;
  } else if (res.location) {
    res.status(204).send();
  } else {
    next();
  }
}

function apiTokenAuthorization(req, res, next) {
  console.log(`${req.method} ${req.path}`);

  console.log(req.path.substring(0, 7));

  if (req.path.substring(0, 7) === '/assets/') {
    next();
  } else {
    const token = req.body.token || req.get('authorization') || req.query.token;

    if (!token) return res.status(401).send({
      success: false,
      message: 'API token missing.'
    });
    else {
      if (token !== keys.apiToken) return res.status(403).send({
        success: false,
        message: 'API token invalid.'
      });
      else next();
    }
  }
}

module.exports = {
  representationConverter: () => generateRepresentationForm,
  authorization: () => apiTokenAuthorization
}