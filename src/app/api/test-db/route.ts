import { NextRequest, NextResponse } from 'next/server';
import { testDatabaseConnection } from '@/lib/db-test';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const isConnected = await testDatabaseConnection();
    
    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'Database connection successful!',
        timestamp: new Date().toISOString(),
        database: 'PostgreSQL with Drizzle ORM',
        tables: [
          'users',
          'accounts', 
          'sessions',
          'training_sections',
          'training_modules', 
          'module_pages',
          'employee_progress',
          'assessment_questions',
          'assessment_results'
        ]
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Database connection failed',
        error: 'Unable to connect to database'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}