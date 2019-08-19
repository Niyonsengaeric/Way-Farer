import Joi from 'joi';

function validateTrip(trip) {
  const schema = {
    seating_capacity: Joi.number()
    .required()
    .min(0)
    .max(1000),
    bus_license_number: Joi.string()
    .regex(/^\S*$/)
    .alphanum()
      .max(50),
    origin: Joi.string()
    .regex(/^\S*$/)
    .alphanum() , 
    destination: Joi.string()
    .regex(/^\S*$/)
    .alphanum(),   
    trip_date: Joi.date().required().min('now'),
    time: Joi.required(),
    fare: Joi.number().required().min(0).max(10000),
    status: Joi.string(),
  };

  return Joi.validate(trip, schema);
}
export default validateTrip;
