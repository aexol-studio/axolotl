// Admin settings placeholder page
export default function AdminSettings() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">General</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Site Name</label>
              <input
                type="text"
                defaultValue="Axolotl Starter"
                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Admin Email</label>
              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* API Settings */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">API Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">GraphQL Endpoint</label>
              <input
                type="text"
                defaultValue="/graphql"
                disabled
                className="w-full bg-slate-700/50 text-slate-400 px-4 py-2 rounded-lg border border-slate-600"
              />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="enableIntrospection" className="rounded" />
              <label htmlFor="enableIntrospection" className="text-slate-300">
                Enable GraphQL Introspection
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
