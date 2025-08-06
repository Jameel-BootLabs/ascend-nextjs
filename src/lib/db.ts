import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create the postgres client
const client = postgres(process.env.DATABASE_URL, {
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create the drizzle database instance
export const db = drizzle(client, { schema });

// Export the client for direct queries if needed
export { client };

// Export the schema for use in other files
export * from './schema';