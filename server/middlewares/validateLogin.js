import Joi from 'joi';

function validatelogin(user) {
  const schema = {

    email: Joi.string()
    .regex(/^\S*$/)
    .max(250)
    .email(),
    password: Joi.string()
    .regex(/^\S*$/)
    .min(5)
    .max(1024),
  };

  return Joi.validate(user, schema);
}
export default validatelogin;
