import React, { useState } from 'react';
import { Route } from '../hooks/useRouter';
import { useAuth } from '../context/AuthContext';
import heroImg from '../assets/images/book_cover_thinking_machines_1792609937276.jpg';

interface Props {
  onNavigate: (route: Route) => void;
}

export const RegisterPage: React.FC<Props> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (register(name, email, password)) {
      onNavigate({ name: 'catalog' });
    } else {
      setError('An account with this email already exists.');
    }
  };

  return (
    <section
      className="min-h-[70vh] flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(28,25,23,0.7), rgba(28,25,23,0.8)), url(${heroImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8 shadow-sm">
        <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">Create Account</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">Join the Athenaeum as a reader.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full py-2.5 rounded-md bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
          >
            Create Account
          </button>
        </form>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-6 text-center">
          Already have an account?{' '}
          <button onClick={() => onNavigate({ name: 'login' })} className="text-amber-700 dark:text-amber-400 hover:underline">
            Sign In
          </button>
        </p>
      </div>
    </section>
  );
};