import env from "./env.js";

export const getDatabaseConnectionOptions = () => ({
  host: env.database.host,
  port: env.database.port,
  user: env.database.user,
  password: env.database.password,
  database: env.database.name,
  ...(env.database.ssl
    ? {
        ssl: {
          rejectUnauthorized: env.database.sslRejectUnauthorized,
        },
      }
    : {}),
});
