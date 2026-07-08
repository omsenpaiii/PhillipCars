import { Pool, type QueryResult, type QueryResultRow } from "pg";

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 2, // limit connection pool size in serverless environments
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 4000,
  });
} else {
  // Prevent multiple pools in development due to hot reloading
  const globalForPostgres = globalThis as typeof globalThis & { _postgresPool?: Pool };
  if (!globalForPostgres._postgresPool) {
    globalForPostgres._postgresPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  pool = globalForPostgres._postgresPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const res = params ? await pool.query(text, params) : await pool.query(text);
  return res as QueryResult<T>;
}

export default pool;
