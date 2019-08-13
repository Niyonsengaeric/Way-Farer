import validate from '../middlewares/validateTrip';
import express from 'express';
import response from '../helpers/response';
const router = express.Router();
//Database connection
import {Client, Pool} from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const {DATABASE_URL} = process.env;
const connectionString = DATABASE_URL;
const client = new Client({
  connectionString
});
client.connect()


class tripscontrolllers {
  static async  regTrip(req, res) {
  const { error } = validate(req.body);
  if (error)
    return response.response(res, 422,'error', `${error.details[0].message}`, true);

    let trip_origin = await client.query('SELECT * FROM trips WHERE origin=$1 ',[
      req.body.origin,
    ]);

    let trip_destination = await client.query('SELECT * FROM trips WHERE destination=$1 ',[
      req.body.destination,
    ]);

    let trip_date = await client.query('SELECT * FROM trips WHERE trip_date=$1 ',[
      req.body.trip_date,
    ]);

    let trip_time = await client.query('SELECT * FROM trips WHERE time=$1 ',[
      req.body.time,
    ]);


  if (trip_origin.rows.length > 0 && trip_destination.rows.length > 0 && trip_date.rows.length > 0 && trip_time.rows.length > 0 )
   {
    return response.response(res, 409,'error', 'trip already registered ', true);

    
  } else {

    let recordTrip = client.query('INSERT INTO trips(seating_capacity, bus_license_number, origin, destination, trip_date, fare,status, time)VALUES($1,$2,$3,$4,$5,$6,$7,$8)',[
      req.body.seating_capacity, req.body.bus_license_number, req.body.origin, req.body.destination, req.body.trip_date, req.body.fare, 'ACTIVE' ,req.body.time,
    ]); 
    if (recordTrip){ 
      const{ seating_capacity,bus_license_number,origin,destination,trip_date,fare,time} =req.body;      
      const payload= { seating_capacity,bus_license_number,origin,destination,trip_date,fare,time }
      return response.response(res, 201,'success', payload, false);
     }

  }
};
static async  cancelTrip(req, res) {

  let trip_id = await client.query('SELECT * FROM trips WHERE id=$1',[
    req.params.id,
  ]);
  if (trip_id.rows[0].status=='CANCELED')
  {
    return response.response(res, 406,'error', 'trip Erleady CANCELED!', true);
    }
  if(trip_id.rows.length>0){ 
    let updatetrip = client.query('UPDATE trips SET status=$1 where id = $2',[
      'CANCELED',req.params.id,
    ])
    trip_id.rows[0].status = 'CANCELED';
      return response.response(res, 200,'success', 'Trip cancelled successfully', false);
    }
 else {
    return response.response(res, 404,'error', 'Trip not Found!', true);
  }
};


static async  getTrips(req, res) {
  client.query('SELECT * FROM trips', function(err, result){
    if (err){
      return response.response(res, 404,'error', 'Error running query');
    }else{
      let resul = result.rows;
      return response.response(res,200,'success',resul,false);      
    }
  })


  }
static async  spfTrip(req, res) {
  const { id } = req.params;
  let searchtrip = await client.query('SELECT * FROM trips WHERE id=$1',[
    req.params.id,
  ]);
  if(searchtrip.rows.length>0){
    return response.response(res, 200,'success', searchtrip.rows,false); 
}
 else {
    return response.response(res, 404,'error', 'Trip not Found!', true);
  }
};
}
export default tripscontrolllers;
