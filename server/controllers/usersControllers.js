import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import validate from '../middlewares/validateUser';
import validateLogin from '../middlewares/validateLogin';
import users from '../models/usersModels';
import express from 'express';
import response from '../helpers/response';
const router = express.Router();

// eslint-disable-next-line
class usersController {
  // view all properties
  static async regUser(req, res) {

// export const regUser = async (req, res) => {
  const { error } = validate(req.body);

  if (error)
    return response.response(res, 422,'error', `${error.details[0].message}`, true);

  // (error.details[0].message

  let user = await users.filter(
    user => user.email.toLowerCase() === req.body.email.toLowerCase()
  );
  if (user.length > 0) {
    return response.response(
      res,
      409,'error',
      'User with that email already registered',
      true
    );
  } else {
    const {
      email,
      first_name,
      last_name,
      password,
      phoneNumber,
      address
    } = req.body;
    // Add to object
    const addUser = {
      // id: Math.floor(Math.random() * 10000000),
      id:users.length + 1,
      email: email.toLowerCase(),
      first_name: first_name.toUpperCase(),
      last_name: last_name.toUpperCase(),
      password: password,
      phoneNumber: phoneNumber,
      address: address.toUpperCase(),
      is_admin: false
    };
    const salt = await bcrypt.genSalt(10);
    addUser.password = await bcrypt.hash(addUser.password, salt);

    users.push(addUser);
    const hideitems=  {...addUser};
    delete hideitems.password;
    response.response(res, 201,'success', hideitems, false);
  }
};
// User log in
static async loginUser(req, res) {
  const { password } = req.body;
  // ###validate userlogin
  const { error } = validateLogin(req.body);
  if (error)
    return response.response(res, 422,'error', `${error.details[0].message}`, true);

  const user = await users.filter(
    user => user.email.toLowerCase() === req.body.email.toLowerCase()
  );
  if (user.length > 0) {
    if (bcrypt.compareSync(password, user[0].password)) {
      const token = jwt.sign(
        { id: user[0].id, is_admin: user[0].is_admin },
        process.env.JWT
      );
      {
        const responses = {
          firstname: user[0].first_name,
          lastname: user[0].last_name,
          email: user[0].email,
          token
        };

        return response.response(res, 200,'success', responses, false);
      }
    } else {
      return response.response(res, 401,'error', 'Invalid user or password', true);
    }
  } else {
    return response.response(res, 401,'error', 'Invalid user or password', true);
  }
};
}
export default usersController;
