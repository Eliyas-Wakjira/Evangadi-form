import mysql from "mysql2/promise";
import { getDatabaseConnectionOptions } from "./databaseOptions.js";

// Create a MySQL connection pool so the application can
// efficiently reuse database connections across requests.
const pool = mysql.createPool({
  ...getDatabaseConnectionOptions(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
