const { query } = require("../src/lib/db");

async function test() {
  console.log("Running test database query...");
  try {
    const res = await query("SELECT 1");
    console.log("Success! Result:", res.rows);
  } catch (err) {
    console.error("Database query failed:", err);
  }
}

test().then(() => process.exit(0)).catch(() => process.exit(1));
