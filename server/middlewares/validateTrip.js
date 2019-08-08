import Joi from "joi";

function validateTrip(trip) {
  const schema = {
    seating_capacity: Joi.number().required(),
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
module.exports = validateTrip;
