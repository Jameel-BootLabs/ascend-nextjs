'use client';

import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import { signIn } from "next-auth/react";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="flex items-center justify-center p-4 pt-16">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to{' '}
            <span className="text-blue-600">Ascend</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Your comprehensive Information Security Training Portal with interactive modules, 
            assessments, and certification tracking.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              ✅ Project Setup Complete
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              ✅ Authentication Ready
            </div>
          </div>
          
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 h-8 w-48 rounded mx-auto"></div>
          ) : isAuthenticated ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium">
                Welcome back, {user?.name}!
              </p>
              <p className="text-blue-600 text-sm">
                Role: {user?.role} | Email: {user?.email}
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-medium">Not signed in</p>
              <button
                onClick={() => signIn("google")}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Sign in with Google
              </button>
            </div>
          )}
          
          <div className="text-gray-500">
            <p>Next.js 15 + TypeScript + Tailwind CSS + Drizzle ORM + NextAuth.js</p>
            <p className="text-sm mt-2">Ready for RBAC and API routes</p>
          </div>
        </div>

        <div className="pt-8 space-y-4">
          <div className="flex gap-4 justify-center">
            <a 
              href="/db-status" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Check Database Status
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            Run <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">npm run dev</code> to start development
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
