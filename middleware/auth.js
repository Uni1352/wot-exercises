var keys = require('../resources/auth.json');

module.exports = () => {
  return (req, res, next) => {
    console.log(`${req.method} ${req.path}`);

    if (req.path.substring(0, 5) === '/css/') {
      next();
    } else {
      var token = req.body.token || req.get('authorization') || req.query.token;

      console.log(req.params);

      if (!token) {
        return res.status(401).send({
          success: false,
          message: 'API token missing.'
        });
      } else {
        next();
      }
    }
  }
};