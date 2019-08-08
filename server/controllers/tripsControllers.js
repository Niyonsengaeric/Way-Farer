import validate from "../middlewares/validateTrip";
import trips from "../models/tripsModels";
import express from "express";
import response from "../helpers/response";
const router = express.Router();

class tripscontrolllers {
  static async  regTrip(req, res) {
// export const regTrip = async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return response.response(res, 400, `${error.details[0].message}`, true);
  let trip_origin = await trips.filter(
    trip_origin =>
      trip_origin.origin.toUpperCase() === req.body.origin.toUpperCase()
  );
  let trip_destination = await trips.filter(
    trip_destination =>
      trip_destination.destination.toUpperCase() ===
      req.body.destination.toUpperCase()
  );
  let trip_date = await trips.filter(
    trip_date => trip_date.trip_date === req.body.trip_date
  );
  let trip_time = await trips.filter(
    trip_time => trip_time.time === req.body.time
  );

  if (
    trip_origin.length > 0 &&
    trip_destination.length > 0 &&
    trip_date.length > 0 &&
    trip_time.length > 0
  ) {
    return response.response(res, 401, "trip already registered ", true);
  } else {
    const {
      seating_capacity,
      bus_license_number,
      origin,
      destination,
      trip_date,
      fare,
      time
    } = req.body;

    const addTrip = {
      // id:Math.floor(Math.random() * 10000000),
      id:trips.length + 1,
      seating_capacity: seating_capacity,
      bus_license_number: bus_license_number.toUpperCase(),
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      trip_date: trip_date,
      fare: fare,
      status: "ACTIVE",
      time: time
    };

    trips.push(addTrip);

    return response.response(res, 201, addTrip, false);
  }
};

static async  cancelTrip(req, res) {
  const { id } = req.params;
  const trip_id = trips.findIndex(trp => trp.id === parseInt(id, 10));
  if (trip_id >= 0) {
    trips[trip_id].status = "CANCELED";
    return response.response(res, 200, "Trip cancelled successfully", false);
  } else {
    return response.response(res, 404, "Trip not Found!", true);
  }
};

static async  getTrips(req, res) {
  return response.response(res, 200, trips, false);
};
static async  spfTrip(req, res) {
  const { id } = req.params;
  const trip_id = trips.find(trp => trp.id === parseInt(id, 10));
  if (trip_id) {
    return response.response(res, 200, trip_id, false);
  } else {
    return response.response(res, 404, "Trip not Found!", true);
  }
};
}
export default tripscontrolllers;
