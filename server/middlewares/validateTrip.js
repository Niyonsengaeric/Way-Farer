import Joi from 'joi';

function validateTrip(trip) {
  const schema = {
    seating_capacity: Joi.number().required().min(0).max(10000),
    bus_license_number: Joi.string()
      .alphanum()
      .max(50)
      .required(),
    origin: Joi.string()
      .alphanum()
      .required(),
    destination: Joi.string()
      .alphanum()
      .required(),
    trip_date: Joi.date().required().min('now'),
    time: Joi.required(),
    fare: Joi.number().required().min(0),
    status: Joi.string(),
  };

  return Joi.validate(trip, schema);
}
export default validateTrip;
