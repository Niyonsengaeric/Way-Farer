import Joi from 'joi';

function validatelogin(user) {
  const schema = {

    email: Joi.string()
    .alphanum()
      .max(250)
      .trim()
      .required()
      .email(),
    password: Joi.string()
    .alphanum()
      .min(5)
      .max(1024)
      .required(),
  };

  return Joi.validate(user, schema);
} 
export default validatelogin;
