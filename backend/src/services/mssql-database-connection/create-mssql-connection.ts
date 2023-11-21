import { config, ConnectionPool } from "mssql";
import { sqlCFGLWILive } from "./mssql.constant";

export const createMSSQLConnection = async () => {
  const pool = new ConnectionPool(sqlCFGLWILive as config);

  await pool.connect();

  return pool;
};
