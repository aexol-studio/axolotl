import { useState } from 'react';
import { gql } from '@/api';

export default function App() {
  const [message, setMessage] = useState<string | null>(null);
  const [echoInput, setEchoInput] = useState('');
  const [echoResult, setEchoResult] = useState<string | null>(null);

  const fetchHello = async () => {
    const data = await gql.query.hello();
    setMessage(data.hello);
  };

  const sendEcho = async () => {
    if (!echoInput.trim()) return;
    const data = await gql.mutation.echo(echoInput);
    setEchoResult(data.echo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-md w-full border border-white/20">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Axolotl</h1>
        <p className="text-purple-200 text-center mb-8">Vite + React + GraphQL</p>

        <div className="space-y-6">
          {/* Hello Query */}
          <div className="bg-white/5 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-white mb-3">Query: hello</h2>
            <button
              onClick={fetchHello}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Fetch Hello
            </button>
            {message && <p className="mt-3 text-green-300 bg-green-900/30 rounded-lg p-3 text-center">{message}</p>}
          </div>

          {/* Echo Mutation */}
          <div className="bg-white/5 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-white mb-3">Mutation: echo</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={echoInput}
                onChange={(e) => setEchoInput(e.target.value)}
                placeholder="Enter a message..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={sendEcho}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Echo
              </button>
            </div>
            {echoResult && <p className="mt-3 text-blue-300 bg-blue-900/30 rounded-lg p-3 text-center">{echoResult}</p>}
          </div>
        </div>

        <p className="text-white/40 text-xs text-center mt-8">
          GraphQL endpoint: <code className="text-purple-300">/graphql</code>
        </p>
      </div>
    </div>
  );
}
