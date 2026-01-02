// Admin dashboard - overview page
export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-white">--</p>
          <p className="text-emerald-400 text-sm mt-2">Connect to fetch</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Total Todos</h3>
          <p className="text-3xl font-bold text-white">--</p>
          <p className="text-emerald-400 text-sm mt-2">Connect to fetch</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Completed</h3>
          <p className="text-3xl font-bold text-white">--</p>
          <p className="text-emerald-400 text-sm mt-2">Connect to fetch</p>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-slate-400">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <span>Admin dashboard skeleton ready</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
            <span>Add real data fetching here</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
            <span>Implement admin queries in schema</span>
          </div>
        </div>
      </div>
    </div>
  );
}
