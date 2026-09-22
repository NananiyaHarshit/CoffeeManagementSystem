import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import { FaCoffee } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password rules validation check
  const rules = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const isPasswordValid = Object.values(rules).every(Boolean);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Password does not meet complexity requirements');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      toast.success('Registration successful! Welcome to Brew Haven.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-16 min-h-screen bg-cream flex items-center justify-center">
      <div className="mx-auto w-full max-w-lg px-4">
        <div className="rounded-3xl bg-white p-8 shadow-card border border-caramel/15 text-center">
          {/* Logo */}
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-caramel text-cream shadow-sm">
            <FaCoffee className="h-6 w-6" />
          </div>

          <h2 className="heading-serif text-2xl font-bold text-dark-espresso">Join Brew Haven</h2>
          <p className="text-xs text-coffee-brown/70 mt-1 mb-6">Create an account to start ordering your coffee</p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-dark-espresso mb-1">Full Name *</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-caramel h-4 w-4" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Eleanor Vance"
                  className="w-full rounded-xl border border-caramel/30 bg-cream/50 pl-10 pr-4 py-2.5 text-xs text-dark-espresso focus:outline-none focus:border-caramel"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-dark-espresso mb-1">Email Address *</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-caramel h-4 w-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="eleanor@example.com"
                    className="w-full rounded-xl border border-caramel/30 bg-cream/50 pl-10 pr-4 py-2.5 text-xs text-dark-espresso focus:outline-none focus:border-caramel"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-espresso mb-1">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-caramel h-4 w-4" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full rounded-xl border border-caramel/30 bg-cream/50 pl-10 pr-4 py-2.5 text-xs text-dark-espresso focus:outline-none focus:border-caramel"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-espresso mb-1">Password *</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-caramel h-4 w-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Password requirements meter */}
            {formData.password && (
              <div className="rounded-xl bg-cream p-3 border border-caramel/20 text-[11px] space-y-1">
                <p className="font-bold text-dark-espresso">Password Requirements:</p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  <div className={`flex items-center gap-1 ${rules.length ? 'text-green-700' : 'text-gray-400'}`}>
                    {rules.length ? <FiCheck /> : <FiX />} Min 8 characters
                  </div>
                  <div className={`flex items-center gap-1 ${rules.uppercase ? 'text-green-700' : 'text-gray-400'}`}>
                    {rules.uppercase ? <FiCheck /> : <FiX />} Uppercase letter
                  </div>
                  <div className={`flex items-center gap-1 ${rules.lowercase ? 'text-green-700' : 'text-gray-400'}`}>
                    {rules.lowercase ? <FiCheck /> : <FiX />} Lowercase letter
                  </div>
                  <div className={`flex items-center gap-1 ${rules.number ? 'text-green-700' : 'text-gray-400'}`}>
                    {rules.number ? <FiCheck /> : <FiX />} At least one number
                  </div>
                  <div className={`flex items-center gap-1 ${rules.special ? 'text-green-700' : 'text-gray-400'}`}>
                    {rules.special ? <FiCheck /> : <FiX />} Special character
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-dark-espresso mb-1">Confirm Password *</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-caramel h-4 w-4" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-caramel/30 bg-cream/50 pl-10 pr-4 py-2.5 text-xs text-dark-espresso focus:outline-none focus:border-caramel"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 rounded-full bg-caramel py-3 text-xs font-bold text-cream shadow-md hover:bg-coffee-brown transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Brew Haven Account'}
            </button>
          </form>

          <p className="text-xs text-coffee-brown/80 mt-6 pt-4 border-t border-cream">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-caramel hover:underline">
              Log In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
