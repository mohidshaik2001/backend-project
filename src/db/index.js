import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
});

db.createTableIfNotExists = async ({ name, columns }) => {
  const cols = columns
    .map((col) => {
      let colDef = `\`${col.name}\` ${col.type}`;
      if (col.primaryKey) colDef += " PRIMARY KEY";
      if (col.autoIncrement) colDef += " AUTO_INCREMENT";
      if (col.unique) colDef += " UNIQUE";
      if (col.default) colDef += ` DEFAULT ${col.default}`;
      return colDef;
    })
    .join(", ");

  const sql = `CREATE TABLE IF NOT EXISTS \`${name}\` (${cols})`;
  await db.query(sql);
  console.log(`✅ Table '${name}' checked/created`);
};
export default db;
