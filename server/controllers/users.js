import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import _ from "lodash";
import validate from "../middlewares/validateUser";
import validateLogin from "../middlewares/validateLogin";
import users from "../models/users";
import express from "express";
import feedback from "../helpers/feedback";
const router = express.Router();

// eslint-disable-next-line

export const regUser = async (req, res) => {
  const { error } = validate(req.body);

  if (error)
    return feedback.response(res, 400, `${error.details[0].message}`, true);

  // (error.details[0].message

  let user = await users.filter(
    user => user.email.toLowerCase() === req.body.email.toLowerCase()
  );
  if (user.length > 0) {
    return feedback.response(
      res,
      401,
      "User with that email already registered",
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
      id: users.length + 1,
      email: email.toLowerCase(),
      first_name: first_name.toUpperCase(),
      last_name: last_name.toUpperCase(),
      password: password,
      phoneNumber: phoneNumber,
      address: address.toUpperCase(),
      isAdmin: false
    };

    const salt = await bcrypt.genSalt(10);
    addUser.password = await bcrypt.hash(addUser.password, salt);

    users.push(addUser);
    feedback.response(res, 201, addUser, false);
  }
};
// User log in

export const loginUser = async (req, res) => {
  const { password } = req.body;
  // ###validate userlogin
  const { error } = validateLogin(req.body);
  if (error)
    return feedback.response(res, 400, `${error.details[0].message}`, true);
  // responses.response(res, 401, true)

  const user = await users.filter(
    user => user.email.toLowerCase() === req.body.email.toLowerCase()
  );
  if (user.length > 0) {
    if (bcrypt.compareSync(password, user[0].password)) {
      // User matched
      // create JWT payload
      //Token

      const token = jwt.sign(
        { id: user[0].id, isAdmin: user[0].isAdmin },
        "jwtPrivatekey"
      );
      {
        const response = {
          firstname: user[0].first_name,
          lastname: user[0].last_name,
          email: user[0].email,
          token
        };

        return feedback.response(res, 200, response, false);
      }
    } else {
      return feedback.response(res, 401, "Invalid user or password", true);
    }
  } else {
    return feedback.response(res, 401, "Invalid user or password", true);
  }
};

export default router;
