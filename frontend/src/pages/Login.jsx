import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { FaCoffee } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      toast.success('Welcome back to Brew Haven!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-16 min-h-screen bg-cream flex items-center justify-center">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-3xl bg-white p-8 shadow-card border border-caramel/15 text-center">
          {/* Logo */}
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-caramel text-cream shadow-sm">
            <FaCoffee className="h-6 w-6" />
          </div>

          <h2 className="heading-serif text-2xl font-bold text-dark-espresso">Welcome Back</h2>
          <p className="text-xs text-coffee-brown/70 mt-1 mb-6">Log in to your Brew Haven account</p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-dark-espresso mb-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-caramel h-4 w-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="w-full rounded-xl border border-caramel/30 bg-cream/50 pl-10 pr-4 py-2.5 text-xs text-dark-espresso focus:outline-none focus:border-caramel"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-espresso mb-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-caramel h-4 w-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-caramel/30 bg-cream/50 pl-10 pr-10 py-2.5 text-xs text-dark-espresso focus:outline-none focus:border-caramel"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-coffee-brown/60 hover:text-dark-espresso"
                >
                  {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-coffee-brown">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-caramel/40 text-caramel focus:ring-caramel"
                />
                Remember me
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Password reset instructions sent to your email.'); }} className="text-caramel font-semibold hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 rounded-full bg-caramel py-3 text-xs font-bold text-cream shadow-md hover:bg-coffee-brown transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <FiArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="text-xs text-coffee-brown/80 mt-6 pt-4 border-t border-cream">
            Don’t have an account?{' '}
            <Link to="/register" className="font-bold text-caramel hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
