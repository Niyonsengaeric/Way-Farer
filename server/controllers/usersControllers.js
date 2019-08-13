import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validate from '../middlewares/validateUser';
import validateLogin from '../middlewares/validateLogin';
import express from 'express';
import response from '../helpers/response';
const router = express.Router();

import {Client, Pool} from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const{JWT} = process.env;
const {DATABASE_URL} = process.env;
const connectionString = DATABASE_URL;
const client = new Client({
  connectionString
});
client.connect()
// eslint-disable-next-line
class usersController {
  // view all properties
  static async regUser(req, res) {

// export const regUser = async (req, res) => {
  const { error } = validate(req.body);

  if (error)
    return response.response(res, 422,'error', `${error.details[0].message}`, true);

  // (error.details[0].message

  let userCheck = await client.query('SELECT * FROM users WHERE email=$1 ',[
    req.body.email,
  ]);
  if (userCheck.rows.length > 0) {
    return response.response(res,409,'error','User already registered');
  } else {

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, async (err, hash) => {
        let newpassword = hash;
        let recordUser = client.query('INSERT INTO users(email, first_name, last_name, password, phonenumber, address, is_admin)VALUES($1,$2,$3,$4,$5,$6,$7)',[
          req.body.email, req.body.first_name, req.body.last_name, newpassword, req.body.phoneNumber, req.body.address, 'false',
        ]); 
        
        if (recordUser){   
          let getId = await client.query('SELECT * FROM users WHERE email=$1 ',[
            req.body.email,
          ]);
          const toBeSigned = {
            id:getId.rows[0].id,
            is_admin: false,
          };         
        jwt.sign(toBeSigned, JWT, { expiresIn: '24h' }, (err, token) => {
          const payload= {

            'firstname':req.body.first_name,
            'lastname':req.body.last_name,
            'email':req.body.email,
            'phoneNumber':req.body.phoneNumber,
            'address':req.body.address,
            'token':token,
          }
          return response.response(res,201,'success',payload,false);  
        });
        
         }
         else{
          return response.response(res, 404, 'Error','Error running query',true);
        }
      });
    });

  }
};
// User log in
static async loginUser(req, res) {
  const { password } = req.body;
  // ###validate userlogin
  const { error } = validateLogin(req.body);
  if (error)
    return response.response(res, 422,'error', `${error.details[0].message}`, true);

  let emailCheck = await client.query('SELECT * FROM users WHERE email=$1',[
    req.body.email,
  ]);

  if (emailCheck.rows.length > 0) {
    if (bcrypt.compareSync(password, emailCheck.rows[0].password)) {
      const token = jwt.sign(
        { id:emailCheck.rows[0].id, is_admin: emailCheck.rows[0].is_admin, },
        process.env.JWT
      );
      {
        const responses = {
          firstname: emailCheck.rows[0].first_name,
          lastname: emailCheck.rows[0].last_name,
          email: emailCheck.rows[0].email,
          phoneNumber:emailCheck.rows[0].phoneNumber,
          address:emailCheck.rows[0].address,
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
