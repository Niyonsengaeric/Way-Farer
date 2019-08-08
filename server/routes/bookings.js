import express from "express";
import auth from "../middlewares/checkAuth";
import bookingsController from '../controllers/bookingControllers';
const {
    book,
     getbookings, 
     deletebooking
  } = bookingsController;

const router = express.Router();
router.post("/bookings", auth, book);
router.get("/bookings", auth, getbookings);
router.delete("/bookings/:id", auth, deletebooking);
export default router;
