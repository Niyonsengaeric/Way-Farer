import express from "express";

import { regUser, loginUser } from "../controllers/users";

const router = express.Router();

router.post("/auth/signup", regUser);
// router.post("/auth/signin", loginUser);
//

export default router;
