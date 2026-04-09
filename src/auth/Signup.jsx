import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { supabase } from '../supabaseClient.js';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isCollegeEmail = (email) => {
    return email.trim().toLowerCase().endsWith('.edu.in');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // College email validation
    if (!isCollegeEmail(formData.email)) {
      setError('Only college email addresses ending with .edu.in are allowed. Personal emails like Gmail are not permitted.');
      setLoading(false);
      return;
    }

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { error: supabaseError } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        },
      },
    });

    setLoading(false);

    if (supabaseError) {
      setError(supabaseError.message);
      return;
    }

    setSuccess(true);
    // Redirect to profile setup after signup
    setTimeout(() => {
      navigate('/user');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden" style={{ fontFamily: "'Georgia', serif" }}>
      <Navbar />

      <div className="flex min-h-screen pt-16">
        {/* LEFT SIDE - Same beautiful image as Login */}
        <div className="hidden lg:flex lg:w-1/2 p-8 relative">
          <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl border border-black/10">
            <img
              src="https://picsum.photos/id/1015/1200/1600"
              alt="Freshers connecting with seniors in tech community"
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent rounded-3xl" />

            <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
              <div className="max-w-md">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full mb-6">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-white/80">JOIN THE COMMUNITY</span>
                  </div>

                  <h2 className="text-5xl font-serif font-bold leading-tight mb-6">
                    Start your journey with<br />
                    <span className="text-black">Linkaura</span>
                  </h2>
                  <p className="text-xl text-white/80 leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
                    Connect with seniors, participate in events, and grow together with thousands of Indian tech students.
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="absolute bottom-10 left-12 text-sm text-white/60 font-black uppercase tracking-[0.35em]">
              GROW TOGETHER • LINKAURA
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Signup Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-4xl font-serif font-bold text-black mb-3">Create your account</h1>
              <p className="text-black/50">Join the Linkaura community today</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-600 text-sm">
                Account created successfully! Please check your email to verify.
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm text-black/50 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40">
                    <FiUser size={20} />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-black/15 focus:border-black rounded-2xl py-4 pl-12 pr-4 text-black placeholder-black/30 focus:outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-black/50 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40">
                    <FiMail size={20} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-black/15 focus:border-black rounded-2xl py-4 pl-12 pr-4 text-black placeholder-black/30 focus:outline-none transition"
                    placeholder="you@college.edu.in"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-black/50 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40">
                    <FiLock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-black/15 focus:border-black rounded-2xl py-4 pl-12 pr-12 text-black placeholder-black/30 focus:outline-none transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60 transition"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm text-black/50 mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40">
                    <FiLock size={20} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-black/15 focus:border-black rounded-2xl py-4 pl-12 pr-12 text-black placeholder-black/30 focus:outline-none transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60 transition"
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-black/80 disabled:bg-black/50 disabled:cursor-not-allowed text-white text-[11px] font-black uppercase tracking-widest py-4 rounded-2xl transition-all duration-200 flex items-center justify-center"
              >
                {loading ? "Creating account..." : "Create Account"}
              </motion.button>
            </form>

            <p className="text-center mt-8 text-black/50">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-black hover:text-black/80 font-black uppercase tracking-widest text-[11px] transition"
              >
                Sign in
              </button>
            </p>

            <p className="text-center text-[10px] text-black/25 mt-10 font-black uppercase tracking-[0.35em]">
              Your data is safe with us • Trusted by Indian tech students
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;