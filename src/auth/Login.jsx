import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { FiMail, FiSend, FiLogIn } from 'react-icons/fi';
import styled, { keyframes } from 'styled-components';
import { signInWithGoogle, sendLoginLink, completeSignInWithEmailLink } from '../firebase/firebase';

// CSS for the rotating fan animation
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const RotatingFanIcon = styled.div`
  animation: ${rotate} 4s linear infinite;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check if this is a redirect back from email sign-in
  useEffect(() => {
    const handleEmailLinkSignIn = async () => {
      if (location.search.includes('mode=signIn')) {
        try {
          setIsLoading(true);
          await completeSignInWithEmailLink();
          navigate('/'); // Redirect to landing page after successful sign-in
        } catch (error) {
          setAuthError(error.message);
          console.error('Error completing email sign in:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleEmailLinkSignIn();
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      setAuthError('');
      
      try {
        await sendLoginLink(formData.email);
        setEmailSent(true);
      } catch (error) {
        console.error('Error sending login link:', error);
        setAuthError(error.message || 'Failed to send login link. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setAuthError('');
      await signInWithGoogle();
      navigate('/'); // Redirect to landing page after successful sign-in
    } catch (error) {
      console.error('Google sign in error:', error);
      setAuthError(error.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="relative w-full min-h-screen bg-gray-900 flex items-center justify-center p-4">
        {/* Background Elements */}
        <div className="fixed top-4 left-4 z-30">
          <RotatingFanIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-300">
              <path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z"/>
              <path d="M12 12v.01"/>
            </svg>
          </RotatingFanIcon>
        </div>

        <div className="w-full max-w-md bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700/50 p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/10 mb-4">
              <FiMail className="h-8 w-8 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-amber-100 mb-2">Check your email</h2>
            <p className="text-gray-300 mb-6">
              We've sent a magic link to <span className="font-medium text-amber-200">{formData.email}</span>.
              Click the link to sign in to your account.
            </p>
            <button
              onClick={() => setEmailSent(false)}
              className="relative group w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-amber-500/20"
            >
              Back to login
              <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </div>
          
          <div className="pt-4 border-t border-gray-700/50">
            <p className="text-sm text-gray-400">
              Didn't receive an email?{' '}
              <button 
                onClick={handleSubmit} 
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors duration-200"
              >
                Resend link
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-4">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 -z-10">
        <img 
          src="/Connect.jpg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>
      {/* Background Elements */}
      <div className="fixed top-4 left-4 z-30">
        <RotatingFanIcon>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-300">
            <path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z"/>
            <path d="M12 12v.01"/>
          </svg>
        </RotatingFanIcon>
      </div>

      <div className="w-full max-w-md bg-transparent overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-200/90 mb-2 font-['redHatDisplay']">Welcome to Brain Forge</h1>
            <p className="text-gray-300 font-light">Sign in to access your account</p>
          </div>

          {authError && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-200 rounded-lg text-sm">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-100/80 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-amber-400/70" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="relative group w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    Send Email Link
                  </>
                )}
                <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2  text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="relative group w-full bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 text-gray-200 font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:border-amber-400/50"
              >
                <FaGoogle className="h-5 w-5 text-red-400" />
                {isLoading ? 'Signing in...' : 'Continue with Google'}
                <span className="absolute inset-0 bg-amber-400/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;