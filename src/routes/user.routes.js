import { Router } from "express";

import {
  userRegister,
  userLogin,
  userLogout,
  refreshAccessToken,
  getCurrentUser,
} from "../controllers/user.controllers.js";
import upload from "../middlewares/multer.middlewares.js";
import { authUser } from "../middlewares/auth.middlewares.js";
const router = Router();

// Accept both JSON and form-data
router.route("/register").post(upload.none(), userRegister);
router.route("/login").post(upload.none(), userLogin);
router.route("/logout").post(authUser, userLogout);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/me").get(authUser, getCurrentUser);
export default router;
