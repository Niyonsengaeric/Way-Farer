export const tables = `
CREATE TABLE
            users(
                id SERIAL PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                first_name TEXT NOT NULL,
                last_name TEXT,
                password TEXT NOT NULL,
                phonenumber TEXT NOT NULL,
                address TEXT NOT NULL,
                is_admin BOOLEAN);
CREATE TABLE
            trips(
                id SERIAL PRIMARY KEY,
                seating_capacity INTEGER NOT NULL ,
                bus_license_number TEXT NOT NULL,
                origin TEXT NOT NULL,
                destination TEXT NOT NULL,
                trip_date DATE NOT NULL,
                fare INTEGER NOT NULL,
                status TEXT NOT NULL,
                time TEXT NOT NULL);
                
CREATE TABLE
          bookings(
              id SERIAL PRIMARY KEY,
              booking_date DATE NOT NULL,
              first_name TEXT NOT NULL,
              last_name TEXT NOT NULL,
              phonenumbe TEXT NOT NULL,
              user_email TEXT NOT NULL,
              bus_license TEXT NOT NULL,
              origin TEXT NOT NULL,
              destination TEXT NOT NULL,
              trip_date DATE NOT NULL,
              time TEXT NOT NULL,
              fare INTEGER NOT NULL,
              trip_id INTEGER NOT NULL,
              user_id INTEGER NOT NULL,        
              FOREIGN KEY(trip_id) REFERENCES trips(id) ON DELETE CASCADE,
              FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);`;
