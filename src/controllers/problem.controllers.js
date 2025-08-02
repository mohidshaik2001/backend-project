import e from "express";
import {
  findAllProblems,
  findProblemById,
  findproblemscount,
} from "../models/problem.models.js";
import { findUserById } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResonse } from "../utils/ApiResponse.utils.js";

const getProblemsCount = asyncHandler(async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    console.log("user", user);
    if (!user) {
      throw new ApiError(402, "unauthorized request,register or login ");
    }
    const problemsCount = await findproblemscount();
    return res.status(200).json(new ApiResonse(200, problemsCount, "success"));
  } catch (error) {
    console.log("error", error);
  }
});

const getProblemsList = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.id);
  //   console.log("user", user);
  if (!user) {
    throw new ApiError(402, "unauthorized request,register or login ");
  }
  const offset = parseInt(req.query.offset || 0);
  const limit = parseInt(req.query.limit || 0);

  const problems = await findAllProblems(offset, limit);
  if (!problems) {
    throw new ApiError(500, "no problems");
  }
  const problemList = problems.map(
    ({ description, solution, testcase, testcaseAnswer, ...rest }) => ({
      ...rest,
    })
  );

  return res.status(200).json(new ApiResonse(200, problemList, "success"));
});

const getProblem = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.id);

  console.log("user", user);

  if (!user) {
    throw new ApiError(402, "unauthorized request,register or login ");
  }
  const problemId = req.params.problemId;
  console.log("problemId", problemId);
  if (!problemId) {
    throw new ApiError(404, "problem not found");
  }
  const problem = await findProblemById(problemId);
  if (!problem) {
    throw new ApiError(404, "problem not found");
  }

  return res.status(200).json(new ApiResonse(200, problem, "success"));
});

export { getProblemsList, getProblem, getProblemsCount };
