export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
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
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✅ Project Setup Complete
          </div>
          <div className="text-gray-500">
            <p>Next.js 15 + TypeScript + Tailwind CSS + Drizzle ORM</p>
            <p className="text-sm mt-2">Ready for authentication and database setup</p>
          </div>
        </div>

        <div className="pt-8">
          <p className="text-gray-400 text-sm">
            Run <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">npm run dev</code> to start development
          </p>
        </div>
      </div>
    </div>
  );
}
