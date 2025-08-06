// Database connection test utility
import { db } from './db';
import { sql } from 'drizzle-orm';

export async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Simple query to test connection
    const result = await db.execute(sql`SELECT 1 as test`);
    
    if (result && result.length > 0) {
      console.log('✅ Database connection successful!');
      return true;
    } else {
      console.log('❌ Database connection failed - no results');
      return false;
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

export async function createDatabaseTables() {
  try {
    console.log('🏗️  Creating database tables...');
    
    // This would run the migration
    // For now, we'll just log that we would do this
    console.log('📋 Migration file ready: drizzle/0000_jazzy_luckman.sql');
    console.log('💡 To create tables, run: npm run db:push');
    console.log('🎯 Or set up a PostgreSQL database and run the migration');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to create tables:', error);
    return false;
  }
}