import Joi from 'joi';
import { join } from 'path';

function validateUser(user) {
  const schema = {
    last_name: Joi.string()
      .alphanum()
      .trim()
      .max(50)
      .required(),
    first_name: Joi.string()
      .alphanum()
      .trim()
      .max(50)
      .required(),
    phoneNumber: Joi.string()
      .trim()
      .max(50)
      .required()
      .strict()
      .regex(/^[0-9]{0,10}$/),
    address: Joi.string()
      .alphanum()  
      .trim()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .trim()
      .min(5)
      .max(250)
      .required()
      .email(),
    password: Joi.string()
      .alphanum()
      .trim()
      .min(5)
      .max(50)
      .required()
  };

  return Joi.validate(user, schema);
}
export default validateUser;
