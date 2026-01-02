// Admin users placeholder page
export default function AdminUsers() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Users</h2>

      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="Search users..."
              className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
            />
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">
              Add User
            </button>
          </div>
        </div>

        {/* Table placeholder */}
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400 text-sm">
              <th className="p-4">Username</th>
              <th className="p-4">Created</th>
              <th className="p-4">Todos</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-700">
              <td className="p-4 text-slate-300" colSpan={4}>
                <div className="text-center text-slate-500">Connect to backend to load users</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
