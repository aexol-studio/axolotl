import type { User } from '../types';

type HeaderProps = {
  user: User | null;
  onLogout: () => void;
};

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Axolotl Todo</h1>
          <p className="text-emerald-200 text-sm">Welcome, {user?.username}</p>
        </div>
        <button
          onClick={onLogout}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
