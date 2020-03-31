const { decodeToken } = require('../util/token');

const authorize = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({
        success: false,
        message: 'unauthorized',
        data: {},
      });
    }
    const stripStart = 'Bearer '.length;
    const userIdToken = authHeader.substring(stripStart);

    const [userId, token] = userIdToken.split(',');

    const decodedToken = await decodeToken(token);

    if (userId !== decodedToken.id) {
      return res.status(401).send({
        success: false,
        message: 'unauthorized',
        data: {},
      });
    }

    if (userId !== req.params.userId) {
      return res.status(403).send({
        success: false,
        message: 'forbidden',
        data: {},
      });
    }

    next();
  } catch (err) {
    return res.status(401).send({
      success: false,
      message: 'unauthorized',
      data: {},
    });
  }
};

module.exports = authorize;
