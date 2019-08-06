import jwt from "jsonwebtoken";
import feedback from "../helpers/feedback";

module.exports = function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. no token provided.");
  try {
    const decoded = jwt.verify(token, "jwtPrivatekey");
    req.user = decoded;

    next();
  } catch (ex) {
    return feedback.response(res, 401, "invalid token.", true);
  }
};
