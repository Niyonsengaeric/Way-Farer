import express from "express";
import auth from "../middlewares/auth";
import { book, getbookings, deletebooking } from "../controllers/bookings";

const router = express.Router();
router.post("/bookings", auth, book);
router.get("/bookings", auth, getbookings);
router.delete("/bookings/:id", auth, deletebooking);

//

export default router;
