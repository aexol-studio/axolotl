import { useState, FormEvent } from 'react';

type TodoFormProps = {
  onSubmit: (content: string) => Promise<boolean>;
  isLoading: boolean;
};

export function TodoForm({ onSubmit, isLoading }: TodoFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const success = await onSubmit(content);
    if (success) {
      setContent('');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 mb-6">
      <h2 className="text-lg font-semibold text-white mb-4">Add New Todo</h2>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Add
        </button>
      </form>
    </div>
  );
}
