import moment from 'moment';
import validate from '../middlewares/validateBooking';
import response from '../helpers/response';
//Database connection
import {Client, Pool} from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const{JWT} = process.env;
const {DATABASE_URL} = process.env;
const connectionString = DATABASE_URL;
const client = new Client({
  connectionString
});
client.connect()


class bookingsController {
  // view all properties
  static async book(req, res) {  
  const { error } = validate(req.body);
  if (error) {
    return response.response(res, 422,'error', `${error.details[0].message}`, true);

  }

  // // ###check trip ID
  const tripid = req.body.tripId;
  let findtripid = await client.query('SELECT * FROM trips WHERE id=$1',[
    req.body.tripId,
  ]);
  if (findtripid.rows.length <=0) 
  { 
    
   return response.response(res, 404,'error', 'No trip found!', true);
 }
  if (findtripid) 
  { 
      // check if trip is activated*
    if (findtripid.rows[0].status == 'CANCELED') {
      return response.response(
        res,
        406,'error',
  
        'TRIP HAS BEEN CANCELED!!! PLEASE TRY ANOTHER DIFFERENT TRIP',
        true
      );
    }


 }
 
  const buslicence = findtripid.rows[0].bus_license_number;
  const origin  = findtripid.rows[0].origin;
  const destination  = findtripid.rows[0].destination;
  const fare = findtripid.rows[0].fare;
  const triptime = findtripid.rows[0].time;
  const tripidnumber = findtripid.rows[0].id;
  const tripdate = findtripid.rows[0].trip_date;
  const seating_capacity = findtripid.rows[0].seating_capacity;


  // // ###check users  req.user.id
  let userCheck = await client.query('SELECT * FROM users WHERE id=$1 ',[
    req.user.id,
  ]);
  const userid = req.user.id;
  // geting user info

  const firstname = userCheck.rows[0].first_name;
  const lastname = userCheck.rows[0].last_name;
  const useremail = userCheck.rows[0].email;
  const userphone = userCheck.rows[0].phonenumber;
 

  // check for booking and save
  if (seating_capacity <= 0) {
    return response.response(
      res,
      406,'error',
      'SORRY!!! No seats left on the trip',
      true
    );
    
  }


  let book = await client.query('SELECT * FROM bookings WHERE trip_id=$1 AND user_id=$2',[
    req.body.tripId,req.user.id,
  ]);

  if (!book.rows[0]) {
    // ##### inserting in table

    let recordbooking = client.query('INSERT INTO bookings(booking_date, first_name,last_name, phonenumber, user_email, bus_license,origin,destination,trip_date,time,fare,trip_id,user_id)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)',[
      moment().format(), firstname,lastname, userphone,useremail,buslicence,origin,destination,tripdate ,triptime,fare,tripidnumber,userid,
    ]);
    if (recordbooking ) {
      // ###update trip seats
        let updatetrip = client.query('UPDATE trips SET seating_capacity=$1 where id = $2',[
          seating_capacity-1,findtripid.rows[0].id,
        ])

        const book= {
          booking_date: moment().format(),
          first_name: firstname.toUpperCase(),
          last_name: lastname.toUpperCase(),
          phonenumber: userphone,
          user_email: useremail.toLowerCase(),
          bus_license_number: buslicence.toUpperCase(),
          origin: origin.toUpperCase(),
          destination: destination.toUpperCase(),
          trip_date: tripdate,
          trip_time: triptime,
          farer:fare,
        }


        return response.response(res, 201,'success', book, false);
  
    }
  }

else {
    return response.response(res, 409,'error', 'booking already made!', true);
  }
};



static async getbookings(req, res) {
  // ###Display all bookings made by users //sa admin
  if (req.user.is_admin)
  {
    client.query('SELECT * FROM bookings', function(err, result){
      if (err){
        return response.response(res, 404,'error', 'Error running query');
      }else{
        let resul = result.rows;
        return response.response(res,200,'success',resul,false);      
      }
    })    
  }
  // ###Display bookings  user for user only
  else{
  let finduserid = await client.query('SELECT * FROM bookings WHERE user_id=$1',[
    req.user.id,
  ]);

  
  if(finduserid.rows.length>0){ 
    return response.response(res, 200,'success', finduserid.rows, false);
    
  }
  return response.response(res, 404,'error', 'no bookings found', true);
}    

 
};


static async deletebooking(req, res) {
  const { id } = req.params;

  let findbook = await client.query('SELECT * FROM bookings WHERE id=$1 AND user_id=$2',[
    parseInt(id, 10),req.user.id,
  ]);

  //###delete a Booking
  if(findbook.rows.length>0){  
    
  let recordprop = client.query('DELETE FROM bookings WHERE id =$1',[
    parseInt(id, 10)
   ]);
   if (recordprop){
    return response.response(res, 200, 'success', 'Booking deleted successfully', false);
   }

  }
 else {
    return response.response(res, 404,'error', 'Booking not Found!', true);
  }
};
}
export default bookingsController;
