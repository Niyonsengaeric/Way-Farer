import moment from "moment";
import _ from "lodash";
import validate from "../middlewares/validateBooking";
import users from "../models/users";
import trips from "../models/trips";
import feedback from "../helpers/feedback";
import bookings from "../models/bookings";

export const book = (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return feedback.response(
      res,
      400,
      "error",
      `${error.details[0].message}`,
      true
    );
  }

  // // ###check trip ID
  const tripid = req.body.tripId;
  const findtripid = trips.find(findtripid => findtripid.id == tripid);
  if (!findtripid)
    return feedback.response(res, 404, "error", "No trip found!", true);
  // check if trip is activated*

  if (findtripid.status == "CANCELED") {
    return feedback.response(
      res,
      400,
      "error",
      "TRIP HAS BEEN CANCELED!!! PLEASE TRY ANOTHER DIFFERENT TRIP",
      true
    );
  }

  // if (!findtripid.status=)

  // console.log(findtripid.id)

  const buslicence = findtripid.bus_license_number;
  const { origin } = findtripid;
  const { destination } = findtripid;
  const { fare } = findtripid;
  const triptime = findtripid.time;
  const tripidnumber = findtripid.id;
  const tripdate = findtripid.trip_date;
  const { seating_capacity } = findtripid;

  // // ###check users  req.user.id
  const finduser = users.find(finduser => finduser.id == req.user.id);
  const userid = req.user.id;

  // geting user info
  const firstname = finduser.first_name;
  const lastname = finduser.last_name;
  const useremail = finduser.email;
  const userphone = finduser.phoneNumber;

  // console.log(userid)

  // check for booking and save
  if (seating_capacity <= 0) {
    return feedback.response(
      res,
      400,
      "error",
      "SORRY!!! No seats left on the trip",
      true
    );
  }
  const book = bookings.find(
    (book => book.user_id == userid) &&
      (book => book.trip_id == findtripid.id && book.user_id == userid)
  );
  if (!book) {
    // ##### checking for left Seatings

    // ###########################

    const addBooking = {
      id: bookings.length + 1,
      booking_date: moment().format(),
      first_name: firstname.toUpperCase(),
      last_name: lastname.toUpperCase(),
      phoneNumber: userphone,
      user_email: useremail.toLowerCase(),
      bus_license_number: buslicence.toUpperCase(),
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      trip_date: tripdate,
      trip_time: triptime,
      fare,
      trip_id: tripidnumber,
      user_id: userid
    };
    bookings.push(addBooking);

    if (addBooking) {
      // ###update trip seats
      const updtrip = trips.findIndex(updtrip => updtrip.id == tripid);
      if (updtrip >= 0) {
        trips[updtrip].seating_capacity = seating_capacity - 1;
        // console.log(updtrip);

        return feedback.response(res, 201, "success", addBooking, false);
      }
    }
  } else {
    return feedback.response(res, 401, "error", "booking already made!", true);
  }
};

export const getbookings = (req, res) => {
  // ###Display all bookings made users //sa admin
  if (req.user.isAdmin) {
    return feedback.response(res, 200, "success", bookings, false);
  }

  // ###Display bookings  user for user only

  const finduserid = bookings.filter(
    finduserid => finduserid.user_id === req.user.id
  );
  if (finduserid.length > 0) {
    return feedback.response(res, 200, "success", finduserid, false);
  }

  return feedback.response(res, 404, "error", "no bookings found", true);
};

export const deletebooking = (req, res) => {
  // ###finding booking index
  const { id } = req.params;
  const findbookingindex = bookings.findIndex(
    findbooking =>
      findbooking.id == parseInt(id, 10) && findbooking.user_id == req.user.id
  );

  //###delete a Booking
  if (findbookingindex !== -1) {
    bookings.splice(findbookingindex, 1);

    return feedback.response(
      res,
      200,
      "success",
      "Booking deleted successfully"
    );
  } else {
    return feedback.response(res, 404, "error", "Booking not Found!", true);
  }
};
