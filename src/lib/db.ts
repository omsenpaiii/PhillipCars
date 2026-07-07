import { Pool } from 'pg';

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} else {
  // Prevent multiple pools in development due to hot reloading
  if (!(global as any)._postgresPool) {
    (global as any)._postgresPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  pool = (global as any)._postgresPool;
}

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  // console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}

export default pool;
