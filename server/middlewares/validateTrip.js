import Joi from 'joi';

function validateTrip(trip) {
  const schema = {
    seating_capacity: Joi.number().required().min(5),
    bus_license_number: Joi.string()
      .max(50)
      .required(),
    origin: Joi.string()
      .max(50)
      .required(),
    destination: Joi.string()
      .max(50)
      .required(),
    trip_date: Joi.date().required(),
    time: Joi.required(),
    fare: Joi.number().required(),
    status: Joi.string()
  };

  return Joi.validate(trip, schema);
}
export default validateTrip;
