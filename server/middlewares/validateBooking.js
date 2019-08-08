import Joi from 'joi';

const validatebook = (book) => {
  const schema = {
    tripId: Joi.number()
      .required(),

  };

  return Joi.validate(book, schema);
}
export default validatebook;
