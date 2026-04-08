import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { supabase } from '../supabaseClient.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const isCollegeEmail = (email) => {
    return email.trim().toLowerCase().endsWith('.edu.in');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isCollegeEmail(email)) {
      setError('Only college email addresses ending with .edu.in are allowed. Personal emails like Gmail are not permitted.');
      setLoading(false);
      return;
    }

    const { error: supabaseError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (supabaseError) {
      setError(supabaseError.message);
      return;
    }

    // Login successful → redirect to profile setup
    navigate('/user');
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />

      <div className="flex min-h-screen pt-16">
        {/* LEFT SIDE - Image */}
        <div className="hidden lg:flex lg:w-1/2 p-8 relative">
          <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl">
            <img
              src="https://picsum.photos/id/1015/1200/1600"
              alt="Freshers connecting with seniors in tech community"
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-transparent rounded-3xl" />

            <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
              <div className="max-w-md">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full mb-6">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs font-mono tracking-widest">LIVE COMMUNITY</span>
                  </div>

                  <h2 className="text-5xl font-serif tracking-tighter leading-tight mb-6">
                    Freshers connect with<br />
                    <span className="text-amber-500">Seniors</span>
                  </h2>
                  <p className="text-xl text-zinc-300 leading-relaxed">
                    First-year students participating in events, hackathons, and study sessions with seniors. 
                    Learning, growing, and building lifelong bonds together.
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="absolute bottom-10 left-12 text-sm text-amber-400/80 font-mono tracking-[0.1em]">
              GROW TOGETHER • LINKAURA
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-zinc-950">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-4xl font-serif tracking-tight mb-3">Welcome back</h1>
              <p className="text-zinc-400">Sign in to your tech community</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                    <FiMail size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-500 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none transition"
                    placeholder="you@college.edu.in"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                    <FiLock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-500 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-zinc-500 focus:outline-none transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-600 disabled:cursor-not-allowed text-black font-bold py-4 rounded-2xl text-lg tracking-wider transition-all duration-200 flex items-center justify-center"
              >
                {loading ? "Signing in..." : "Sign In"}
              </motion.button>
            </form>

            <p className="text-center mt-8 text-zinc-400">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-amber-500 hover:text-amber-400 font-medium transition"
              >
                Create one free
              </button>
            </p>

            <p className="text-center text-[10px] text-zinc-500 mt-10">
              Your data is safe with us • Trusted by Indian tech students
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;