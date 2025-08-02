import db from "../db/index.js";
const submissionTable = {
  name: "submissions",
  columns: [
    { name: "id", type: "int", primaryKey: true, autoIncrement: true },
    { name: "userId", type: "int" },
    { name: "problemId", type: "int" },
    { name: "language", type: "varchar(255)" },
    { name: "code", type: "text" },
    { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
    {
      name: "updatedAt",
      type: "timestamp",
      default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
    },
  ],
};

export default async (db) => {
  await db.createTableIfNotExists(submissionTable);
};

const getsubmissionsbyuserId = async (id) => {
  const [rows] = await db.query("SELECT * FROM submissions WHERE userId = ?", [
    id,
  ]);
  if (!rows || rows.length === 0) {
    throw new ApiError(404, "submission not found");
  }
  return rows;
};

const getsubmissionsbyProblemId = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM submissions WHERE problemId = ?",
    [id]
  );

  if (!rows || rows.length === 0) {
    throw new ApiError(404, "submission not found");
  }
  return rows;
};
const getsubmissionsbyId = async (id) => {
  const [rows] = await db.query("SELECT * FROM submissions WHERE id = ?", [id]);
  if (!rows || rows.length === 0) {
    throw new ApiError(404, "submission not found");
  }
  return rows[0];
};

export {
  getsubmissionsbyuserId,
  getsubmissionsbyProblemId,
  getsubmissionsbyId,
};
