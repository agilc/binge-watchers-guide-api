const { decodeToken } = require('../util/token');

const { User } = require('../model/users');

const admin = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const adminUsersObj = await User.find(
      { is_admin: true },
      { is_admin: 1 }
    ).lean();

    const adminUserIds = new Set(
      adminUsersObj.map(user => user._id.toString())
    );

    if (!adminUserIds.has(userId)) {
      return res.status(403).send({
        success: false,
        message: 'forbidden',
        data: {},
      });
    }

    next();
  } catch (err) {
    return res.status(403).send({
      success: false,
      message: 'forbidden',
      data: {},
    });
  }
};

module.exports = admin;
