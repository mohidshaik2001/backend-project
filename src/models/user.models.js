// models/users.js
import db from "../db/index.js";

const usersTable = {
  name: "users",
  columns: [
    { name: "id", type: "int", primaryKey: true, autoIncrement: true },
    { name: "username", type: "varchar(255)", unique: true },
    { name: "email", type: "varchar(255)", unique: true },
    { name: "password", type: "varchar(255)" },
    { name: "fullname", type: "varchar(255)" },
    {
      name: "refreshToken",
      type: "varchar(255)",
      unique: true,
      default: "NULL",
    },
    { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
    {
      name: "updatedAt",
      type: "timestamp",
      default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
    },
  ],
};

export default async (db) => {
  await db.createTableIfNotExists(usersTable);
};

// models/users.js
const findUserById = async (id) => {
  const query = "SELECT * FROM users WHERE id = ?";
  const [user] = await db.query(query, [id]).then((result) => {
    return result[0];
  });
  return user;
};

export { findUserById };
