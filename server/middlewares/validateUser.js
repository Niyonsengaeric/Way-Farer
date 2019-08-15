import Joi from 'joi';
import { join } from 'path';

function validateUser(user) {
  const schema = {
    last_name: Joi.string()
      .regex(/^\S*$/)
      .alphanum(),      
    first_name: Joi.string()
    .regex(/^\S*$/)
    .alphanum(), 
    phoneNumber: Joi.string()
    .regex(/^\S*$/)
      .max(15)
      .required()
      .strict()
      .regex(/^[0-9]{0,10}$/),
    address: Joi.string()
    .regex(/^\S*$/)
    .alphanum()
      .min(5)
      .max(50),
    email: Joi.string()
    .regex(/^\S*$/)
      .min(5)
      .max(250)
      .email(),
    password: Joi.string()
    .regex(/^\S*$/)
      .alphanum()
      .min(5)
      .max(9)
  };

  return Joi.validate(user, schema);
}
export default validateUser;
