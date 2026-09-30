import { Pool, types } from "pg";
import dotenv from "dotenv";

dotenv.config();

// NUMERIC (oid 1700) chega como string por padrão; converte para number (preço)
types.setTypeParser(1700, (value: string) => parseFloat(value));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
