import { Router } from "express";
import upload from "../middlewares/multer.middlewares.js";
import { authUser } from "../middlewares/auth.middlewares.js";
import {
  getProblemSubmissions,
  getUserSubmissions,
  makesubmission,
  getsubmission,
} from "../controllers/submission.controllers.js";

const router = Router();

router.route("/user").get(authUser, getUserSubmissions);
router.route("/problem/:id").get(authUser, getProblemSubmissions);
router.route("/submit").post(upload.none(), authUser, makesubmission);
router.route("/submission/:id").get(authUser, getsubmission);
export default router;
