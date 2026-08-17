import { Pool, type PoolClient, type PoolConfig, type QueryResult, type QueryResultRow } from "pg";

let pool: Pool;

function getPoolConfig(): PoolConfig {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return { connectionString };
  }

  const databaseUrl = new URL(connectionString);
  const isSupabasePooler = databaseUrl.hostname.endsWith(".pooler.supabase.com");

  if (!isSupabasePooler) {
    return { connectionString };
  }

  databaseUrl.searchParams.delete("sslmode");
  databaseUrl.searchParams.delete("sslcert");
  databaseUrl.searchParams.delete("sslkey");
  databaseUrl.searchParams.delete("sslrootcert");

  return {
    connectionString: databaseUrl.toString(),
    ssl: { rejectUnauthorized: false },
  };
}

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    ...getPoolConfig(),
    max: 2, // limit connection pool size in serverless environments
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 4000,
  });
} else {
  // Prevent multiple pools in development due to hot reloading
  const globalForPostgres = globalThis as typeof globalThis & { _postgresPool?: Pool };
  if (!globalForPostgres._postgresPool) {
    globalForPostgres._postgresPool = new Pool({
      ...getPoolConfig(),
      connectionTimeoutMillis: 4000,
      idleTimeoutMillis: 10000,
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

export async function withTransaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export default pool;
