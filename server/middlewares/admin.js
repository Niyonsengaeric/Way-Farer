import feedback from '../helpers/feedback';
import users from '../models/users';

module.exports = function (req, res, next) {
  // check if it is admin or not
  // 401 authorized
  // 403 Forbidden

  if (!req.user.isAdmin) return feedback.response(res, 403, 'You dont have a permission to perform this action', true);

  next();
};
