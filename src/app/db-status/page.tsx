'use client';

import { useState, useEffect } from 'react';

interface DatabaseStatus {
  success: boolean;
  message: string;
  timestamp?: string;
  database?: string;
  tables?: string[];
  error?: string;
}

export default function DatabaseStatusPage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkDatabase() {
      try {
        const response = await fetch('/api/test-db');
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        setStatus({
          success: false,
          message: 'Failed to fetch database status',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        setLoading(false);
      }
    }

    checkDatabase();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Testing database connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">
              Database Status
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Connection and schema verification for Ascend
            </p>
          </div>
          
          <div className="p-6">
            <div className="flex items-center mb-4">
              {status?.success ? (
                <div className="flex items-center text-green-600">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Connected</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Disconnected</span>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Status</h3>
                <p className={`text-sm ${status?.success ? 'text-green-600' : 'text-red-600'}`}>
                  {status?.message}
                </p>
              </div>
              
              {status?.database && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Database</h3>
                  <p className="text-sm text-gray-600">{status.database}</p>
                </div>
              )}
              
              {status?.timestamp && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Last Checked</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(status.timestamp).toLocaleString()}
                  </p>
                </div>
              )}
              
              {status?.tables && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Schema Tables</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {status.tables.map((table) => (
                      <div key={table} className="bg-gray-50 px-3 py-2 rounded text-sm text-gray-700">
                        {table}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {status?.error && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Error Details</h3>
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded">
                    {status.error}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Next Steps</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {status?.success ? (
                  <>
                    <p>✅ Database connection is working</p>
                    <p>✅ Schema is properly defined</p>
                    <p>🔧 Ready to set up authentication</p>
                  </>
                ) : (
                  <>
                    <p>❌ Database connection failed</p>
                    <p>🔧 Update DATABASE_URL in .env.local</p>
                    <p>🔧 Ensure PostgreSQL is running</p>
                    <p>🔧 Run migrations with npm run db:push</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}