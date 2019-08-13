import dotenv from 'dotenv';
import Client from '../config/index';

import { tables,recordUser } from './tableQueries';

dotenv.config();
Client.connect();
// Run table queries
export const createTables = () => {
  
  Client.query(tables)
    .then(() =>{
      Client.end();
    })
    .catch();
};
export const insertadmin = () => {
  
  Client.query(recordUser)
    .then(() =>{
      Client.end();
    })
    .catch();
};
//Delete them
export const tearDown = () => {
  const deleteQuery = 'DROP TABLE IF EXISTS users, trips,  bookings CASCADE';

  Client.query(deleteQuery)
    .then(() => {
      Client.end();
    })
    .catch();
};
require('make-runnable');