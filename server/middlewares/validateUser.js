import Joi from 'joi';
import { join } from 'path';

function validateUser(user) {
  const schema = {
    last_name: Joi.string()
      .max(50)
      .required(),
    first_name: Joi.string()
      .max(50)
      .required(),
    phoneNumber: Joi.string()
      .max(50)
      .required()
      .strict()
      .regex(/^[0-9]{0,10}$/),
    address: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(250)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(50)
      .required()
  };

  return Joi.validate(user, schema);
}
export default validateUser;
