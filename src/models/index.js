import userTableCreate from "./user.models.js";
import problemTableCreate from "./problem.models.js";
import submissionTableCreate from "./submission.models.js";

export default async (db) => {
  await userTableCreate(db);
  await problemTableCreate(db);
  await submissionTableCreate(db);
};
