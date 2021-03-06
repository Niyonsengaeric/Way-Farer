import moment from 'moment';
import { Client } from 'pg';
import dotenv from 'dotenv';
import validate from '../middlewares/validateBooking';
import response from '../helpers/response';
// Database connection

dotenv.config();
const { DATABASE_URL } = process.env;
const connectionString = DATABASE_URL;
const client = new Client({
  connectionString,
});
client.connect();

class bookingsController {
  // view all properties
  static async book(req, res) {
    const { error } = validate(req.body);
    if (error) {
      return response.response(res, 422, 'error', `${error.details[0].message}`, true);
    }

    // // ###check trip ID
    const tripid = req.body.tripId;
    const findtripid = await client.query('SELECT * FROM trips WHERE id=$1', [
      tripid,
    ]);
    if (findtripid.rows.length <= 0) {
      return response.response(res, 404, 'error', 'No trip found!', true);
    }
    if (findtripid) {
      // check if trip is activated*
      if (findtripid.rows[0].status === 'CANCELED') {
        return response.response(res, 406, 'error', 'TRIP HAS BEEN CANCELED!!! PLEASE TRY ANOTHER DIFFERENT TRIP', true);
      }
    }

    const {
      bus_license_number, origin, destination, fare, time, id, trip_date, seating_capacity,
    } = findtripid.rows[0];


    // // ###check users  req.user.id
    const { id: userid } = req.user;
    const userCheck = await client.query('SELECT * FROM users WHERE id=$1 ', [
      userid,
    ]);

    // geting user info
    const {
      first_name, last_name, email, phonenumber,
    } = userCheck.rows[0];

    // check for booking and save

    if (seating_capacity <= 0) { return response.response(res, 406, 'error', 'SORRY!!! No seats left on the trip', true); }
    const book = await client.query('SELECT * FROM bookings WHERE trip_id=$1 AND user_id=$2', [
      tripid, userid,
    ]);

    // ##### inserting in table
      const cols = 'booking_date, first_name,last_name, phonenumber, user_email, bus_license,origin,destination,trip_date,time,fare,trip_id,user_id';
      const cels = '$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13';
      const data = [
        moment().format(), first_name, last_name, phonenumber, email, bus_license_number, origin, destination, trip_date, time, fare, id, userid,
      ];
      const recordbooking = client.query(
        `INSERT INTO bookings(${cols})VALUES(${cels})`, data,
      );
      if (recordbooking) {
      // ###update trip seats
      const{id:tripId}=findtripid.rows[0]
        const updatetrip = client.query('UPDATE trips SET seating_capacity=$1 where id = $2', [
          seating_capacity - 1, tripId,
        ]);
        const getbook = {
          booking_date: moment().format(),
          first_name,
          last_name,
          phonenumber,
          email,
          bus_license_number,
          origin,
          destination,
          trip_date,
          time,
          fare,
        };
        return response.response(res, 201, 'success', getbook, false);
      }
    
  }


  static async getbookings(req, res) {
  // ###Display all bookings made by users //as admin
  const { id: userId,is_admin } = req.user;
    if (is_admin) {
      client.query('SELECT * FROM bookings', (err, result) => {
        if (result.rows.length<=0) {
          return response.response(res, 404, 'error', 'No Booking Yet!!!');
        }
        const resul = result.rows;
        return response.response(res, 200, 'success', resul, false);
      });
    }
    // ###Display to the user his own bookings
    else {
      const finduserid = await client.query('SELECT * FROM bookings WHERE user_id=$1', [
        userId,
      ]);


      if (finduserid.rows.length > 0) {
        return response.response(res, 200, 'success', finduserid.rows, false);
      }
      return response.response(res, 404, 'error', 'no bookings found', true);
    }
  }


  static async deletebooking(req, res) {
    const { id } = req.params;

    const findbook = await client.query('SELECT * FROM bookings WHERE id=$1 AND user_id=$2', [
      parseInt(id, 10), req.user.id,
    ]);

    // ###delete a Booking
    
    if (findbook.rows.length > 0) {
      const {trip_id}=findbook.rows[0]
      const recordprop = client.query('DELETE FROM bookings WHERE id =$1', [
        parseInt(id, 10),
      ]);
      if (recordprop) {
        const findtripid = await client.query('SELECT * FROM trips WHERE id=$1', [
          trip_id,
        ]);
        const{seating_capacity}=findtripid.rows[0]
        const updatetrips = client.query('UPDATE trips SET seating_capacity=$1 where id = $2', [
          seating_capacity + 1,trip_id ,
        ]);
        return response.response(res, 200, 'success', 'Booking deleted successfully', false);
      }
    } else {
      return response.response(res, 404, 'error', 'No Booking find ', true);
    }
  }
}
export default bookingsController;
