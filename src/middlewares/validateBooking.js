import Joi from 'joi';

function validatebook(book) {
  const schema = {
    tripId: Joi.number()
      .required(),

  };

  return Joi.validate(book, schema);
}


module.exports = validatebook;
