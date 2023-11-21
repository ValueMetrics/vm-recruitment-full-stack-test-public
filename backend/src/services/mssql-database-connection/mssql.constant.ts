export const sqlCFGLWILive = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  server: process.env.MSSQL_SERVER,
  requestTimeout: 12000000,
  connectionTimeout: 30000000,
  pool: {
    idleTimeoutMillis: 30000,
    max: 100,
  },
  options: {
    enableArithAbort: true,
    useUTC: false,
    trustServerCertificate: true,
  },
};
