// models/problems.js
import db from "../db/index.js";

const problemsTable = {
  name: "problems",
  columns: [
    { name: "id", type: "int", primaryKey: true, autoIncrement: true },
    { name: "creatorId", type: "int" },
    { name: "title", type: "varchar(255)" },
    { name: "description", type: "text" },
    { name: "testcase", type: "text" },
    { name: "testcaseAnswer", type: "text" },
    { name: "solution", type: "text" },
    { name: "difficulty", type: 'enum("easy", "medium", "hard")' },
    { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
    {
      name: "updatedAt",
      type: "timestamp",
      default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
    },
  ],
};

export default async (db) => {
  await db.createTableIfNotExists(problemsTable);
};

// methods/problems.js

const findAllProblems = async (offset, limit) => {
  const [rows] = await db.query("SELECT * FROM problems LIMIT ? OFFSET ?", [
    limit,
    offset,
  ]);
  if (!rows) {
    throw new ApiError(500, "no problems");
  }
  return rows;
};

const findProblemById = async (id) => {
  const [rows] = await db.query("SELECT * FROM problems WHERE id = ?", [id]);
  if (!rows) {
    throw new ApiError(404, "problem not found");
  }
  return rows[0];
};
const findproblemscount = async () => {
  const [rows] = await db.query("SELECT COUNT(*) as count FROM problems");
  console.log("rows", rows);
  if (!rows) {
    throw new ApiError(404, "problem not found");
  }
  return rows[0];
};
export { findAllProblems, findProblemById, findproblemscount };
