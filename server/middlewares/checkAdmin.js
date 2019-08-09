import response from '../helpers/response';
import users from '../models/usersModels';

module.exports = function (req, res, next) {

  if (!req.user.is_admin) return response.response(res, 401, 'You dont have a permission to perform this action', true);

  next();
};
