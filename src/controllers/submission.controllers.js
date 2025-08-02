import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResonse } from "../utils/ApiResponse.utils.js";
import {
  getsubmissionsbyProblemId,
  getsubmissionsbyuserId,
  getsubmissionsbyId,
} from "../models/submission.models.js";
import { findUserById } from "../models/user.models.js";
import db from "../db/index.js";

const getUserSubmissions = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.id);

  if (!user) {
    throw new ApiError(404, "user not found");
  }
  const submissions = await getsubmissionsbyuserId(user.id);
  console.log("submissions", submissions);
  if (!submissions || submissions.length === 0) {
    throw new ApiError(404, "submissions not found");
  }
  return res.status(200).json(new ApiResonse(200, submissions, "success"));
});

const getProblemSubmissions = asyncHandler(async (req, res) => {
  const problemId = req.params?.id;
  if (!problemId) {
    throw new ApiError(404, "problem not found");
  }
  const submissions = await getsubmissionsbyProblemId(problemId);
  if (!submissions || submissions.length === 0) {
    throw new ApiError(404, "submissions not found");
  }
  return res.status(200).json(new ApiResonse(200, submissions, "success"));
});

const makesubmission = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  console.log("user", userId);
  if (!userId) {
    throw new ApiError(404, "user not found");
  }

  const { problemId, language, code } = req.body;
  if (
    [problemId, language].some((field) => {
      field.trim() === "";
    })
  ) {
    throw new ApiError(400, "all fields are required");
  }
  //call a function to check if the code given is valid
  //lets assume randomly either correct or incorrect
  const isCorrect = true;
  if (!isCorrect) {
    return res.status(300).json(new ApiResonse(300, null, "wrong answer"));
  } else {
    const [{ insertId }] = await db.query(
      "INSERT INTO submissions (userId, problemId, language, code) VALUES (?, ?, ?, ?)",
      [userId, problemId, language, code]
    );
    const submission = await getsubmissionsbyId(insertId);
    return res.status(200).json(new ApiResonse(200, submission, "success"));
  }
});
const getsubmission = asyncHandler(async (req, res) => {
  const submissionId = req.params?.id;
  if (!submissionId) {
    throw new ApiError(404, "submission not found");
  }
  const submission = await getsubmissionsbyId(submissionId);
  if (!submission) {
    throw new ApiError(404, "submission not found");
  }
  return res.status(200).json(new ApiResonse(200, submission, "success"));
});

export {
  getUserSubmissions,
  getProblemSubmissions,
  makesubmission,
  getsubmission,
};
