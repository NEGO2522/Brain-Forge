import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { FiMail, FiSend, FiArrowLeft, FiShield } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithGoogle, sendLoginLink, completeSignInWithEmailLink } from '../firebase/firebase';
import { RotatingFanIcon } from '../components/RotatingFanIcon';

const Login = () => {
  const [formData, setFormData] = useState({ email: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleEmailLinkSignIn = async () => {
      if (location.search.includes('mode=signIn')) {
        try {
          setIsLoading(true);
          await completeSignInWithEmailLink();
          navigate('/user');
        } catch (error) {
          setAuthError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };
    handleEmailLinkSignIn();
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Identity Link required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid link format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setAuthError('');
      try {
        await sendLoginLink(formData.email);
        setEmailSent(true);
      } catch (error) {
        setAuthError(error.message || 'Transmission failed.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setAuthError('');
      await signInWithGoogle();
      navigate('/user');
    } catch (error) {
      setAuthError(error.message || 'Google Auth Failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-black text-white relative overflow-hidden flex items-center justify-center px-6">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <img src="/Connect.jpg" className="w-full h-full object-cover opacity-30" alt="bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        {!emailSent ? (
          <motion.div 
            key="login-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-full max-w-md"
          >
            {/* Logo Header */}
            <div className="flex flex-col items-center mb-8">
              <RotatingFanIcon>
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                  <FiShield className="text-3xl text-amber-500" />
                </div>
              </RotatingFanIcon>
              <h1 className="text-4xl font-serif italic text-white tracking-tight">Establish <span className="text-amber-500">Uplink</span></h1>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] mt-2 font-bold text-center">Linkora Ecosystem Portal</p>
            </div>

            {/* Login Card */}
            <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
              
              {authError && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center uppercase tracking-widest">
                  {authError}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1 mb-2 block">Identity Email</label>
                  <div className="relative group">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="user@linkora.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all"
                    />
                  </div>
                  {errors.email && <p className="text-[10px] text-red-500 mt-2 ml-1 uppercase">{errors.email}</p>}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="w-full py-4 bg-amber-500 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(245,158,11,0.2)] hover:bg-amber-400 transition-all"
                >
                  {isLoading ? "Connecting..." : <><FiSend /> Request Magic Link</>}
                </motion.button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <div className="relative flex justify-center text-[8px] uppercase tracking-[0.3em] text-gray-500 font-bold">Fast-Track Entry</div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all group"
              >
                <FaGoogle className="text-red-500 group-hover:scale-110 transition-transform" /> Sign in with Google-ID
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="success-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-md text-center"
          >
            <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-amber-500/30 p-12 shadow-[0_0_50px_rgba(245,158,11,0.1)]">
              <div className="w-20 h-20 bg-amber-500 rounded-full mx-auto flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                <FiMail className="text-3xl text-black" />
              </div>
              <h2 className="text-3xl font-serif italic mb-4">Link Sent</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                A verification bridge has been sent to <br />
                <span className="text-amber-500 font-mono">{formData.email}</span>. <br />
                Check your inbox to finalize your connection.
              </p>
              <button 
                onClick={() => setEmailSent(false)}
                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mx-auto text-xs uppercase tracking-widest font-bold"
              >
                <FiArrowLeft /> Back to Login
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Branding */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-20">
        <p className="text-[8px] tracking-[1em] uppercase font-black">Linkora Unified Network</p>
      </div>
    </div>
  );
};

export default Login;