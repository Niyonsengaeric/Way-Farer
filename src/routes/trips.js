import express from "express";

import { regTrip, cancelTrip, getTrips, spfTrip } from "../controllers/trips";
import auth from "../middlewares/auth";
import admin from "../middlewares/admin";
const router = express.Router();

router.post("/trips", [auth, admin], regTrip);
router.patch("/trips/:id/cancel", [auth, admin], cancelTrip);
router.get("/trips", auth, getTrips);
router.get("/trips/:id", auth, spfTrip);

// '/', auth

export default router;
