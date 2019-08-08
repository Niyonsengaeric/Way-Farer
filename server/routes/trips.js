import express from "express";
import auth from "../middlewares/checkAuth";
import admin from "../middlewares/checkAdmin";
import tripscontrolllers from '../controllers/tripsControllers';
const {
    regTrip,
    cancelTrip,
    getTrips,
    spfTrip
  } = tripscontrolllers;

const router = express.Router();

router.post("/trips", [auth, admin], regTrip);

router.patch("/trips/:id/cancel", [auth, admin], cancelTrip);
router.get("/trips", auth, getTrips);
router.get("/trips/:id", auth, spfTrip);




// '/',

export default router;
