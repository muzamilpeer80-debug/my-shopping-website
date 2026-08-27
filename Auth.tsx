import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Link, navigate } from '@/lib/router';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Auth() {
  const { signIn, signUp, session } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (session) { navigate('/account'); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) setError(error);
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) setError(error);
        else setError('Check your email for confirmation. (If email confirmation is off, try signing in.)');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 lg:pt-32 pb-20 min-h-screen flex items-center">
      <div className="container-narrow w-full">
        <Breadcrumbs crumbs={[{ label: mode === 'login' ? 'Sign In' : 'Register' }]} />

        <div className="max-w-md mx-auto mt-12">
          <div className="text-center mb-10">
            <Link to="/" className="font-display text-3xl tracking-[0.25em]">VÉRONA</Link>
            <h1 className="font-display text-4xl mt-6 mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Join the House'}
            </h1>
            <p className="text-ink-500 text-sm">
              {mode === 'login' ? 'Sign in to access your account' : 'Create an account to start your journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div>
                <label className="label-lux">Full Name</label>
                <div className="relative">
                  <User className="absolute left-0 top-3.5 w-4 h-4 text-ink-400" />
                  <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="input-lux pl-7" placeholder="Your name" />
                </div>
              </div>
            )}
            <div>
              <label className="label-lux">Email</label>
              <div className="relative">
                <Mail className="absolute left-0 top-3.5 w-4 h-4 text-ink-400" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-lux pl-7" placeholder="email@example.com" />
              </div>
            </div>
            <div>
              <label className="label-lux">Password</label>
              <div className="relative">
                <Lock className="absolute left-0 top-3.5 w-4 h-4 text-ink-400" />
                <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="input-lux pl-7" placeholder="••••••••" />
              </div>
            </div>

            {error && <p className={`text-sm ${error.includes('Check your email') ? 'text-accent-dark' : 'text-red-600'}`}>{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Please wait...' : (<>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-8">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }} className="text-ink-900 underline">
              {mode === 'login' ? 'Register' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
