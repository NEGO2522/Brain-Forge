import React, { useState, createContext, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { RotatingFanIcon } from './RotatingFanIcon';
import { FaUserCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export const MenuContext = createContext({
  isMenuOpen: false,
  setIsMenuOpen: () => {}
});

export const MenuProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <MenuContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
      {children}
    </MenuContext.Provider>
  );
};

const Navbar = () => {
  const { isMenuOpen, setIsMenuOpen } = useContext(MenuContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleProfileClick = () => {
    navigate('/user');
    setIsMenuOpen(false);
  };

  // --- UPDATED NAV LINKS WITH EXPLORE ---
  const navLinks = [
    { to: "/", text: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { to: "/explore", text: "Explore", icon: "M12 21a9 9 0 100-18 9 9 0 000 18z M14.5 9.5L10 14l-2.5-4.5L12 5l2.5 4.5z" },
    { to: "/community", text: "Community", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { to: "/profiles", text: "Profiles", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { to: "/about", text: "About", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { to: "/connect", text: "Connect", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 ${scrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-3 group z-[110]">
          <RotatingFanIcon>
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 group-hover:border-amber-500/50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                <path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z"/>
                <path d="M12 12v.01"/>
              </svg>
            </div>
          </RotatingFanIcon>
          <span className="text-xl font-serif tracking-tighter text-white group-hover:text-amber-500 transition-colors hidden sm:block">
            BRAIN<span className="italic font-light text-amber-500">FORGE</span>
          </span>
        </Link>

        {/* DESKTOP FLOATING MENU */}
        <div className="hidden sm:flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-2 py-1.5 absolute left-1/2 -translate-x-1/2 shadow-2xl">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-5 py-2 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 flex items-center gap-2 ${
                  isActive ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.text}
              </Link>
            );
          })}
        </div>

        {/* RIGHT SECTION (PROFILE/LOGIN) */}
        <div className="flex items-center gap-4 z-[110]">
          <div className="hidden sm:block">
            {isLoggedIn ? (
              <button onClick={handleProfileClick} className="p-1 border border-white/10 rounded-full hover:border-amber-500/50 transition-all">
                <FaUserCircle className="w-8 h-8 text-white/80 hover:text-amber-500 transition-colors" />
              </button>
            ) : (
              <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2.5 bg-white text-black rounded-xl hover:bg-amber-500 transition-colors">
                Sign In
              </Link>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            className="sm:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-white/5 border border-white/10 rounded-xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`w-5 h-0.5 bg-amber-500 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-5 h-0.5 bg-amber-500 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-amber-500 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] flex flex-col justify-center px-12 sm:hidden"
          >
            <div className="space-y-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    to={link.to} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-4xl font-serif text-white hover:text-amber-500 transition-colors flex items-center gap-4 group"
                  >
                    <span className="text-xs font-mono text-amber-500 opacity-50 group-hover:opacity-100">0{i+1}</span>
                    {link.text}
                  </Link>
                </motion.div>
              ))}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.5 }}
                className="pt-12 border-t border-white/10"
              >
                {isLoggedIn ? (
                  <button onClick={handleProfileClick} className="text-amber-500 font-bold uppercase tracking-widest flex items-center gap-3">
                    <FaUserCircle className="text-2xl" /> View Profile
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-amber-500 font-bold uppercase tracking-widest">
                    Access Terminal (Login)
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;