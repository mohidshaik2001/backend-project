import { Router } from "express";
import { authUser } from "../middlewares/auth.middlewares.js";
import {
  getProblem,
  getProblemsList,
  getProblemsCount,
} from "../controllers/problem.controllers.js";

const router = Router();

router.route("/list").get(authUser, getProblemsList);
router.route("/count").get(authUser, getProblemsCount);
router.route("/:problemId").get(authUser, getProblem);
export default router;
