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

  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/explore", text: "Explore" },
    { to: "/community", text: "Community" },
    { to: "/profiles", text: "Profiles" },
    { to: "/about", text: "About" },
    { to: "/connect", text: "Connect" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 md:px-6 ${scrolled ? 'py-3 md:py-4 bg-black/70 backdrop-blur-lg border-b border-white/5' : 'py-6 md:py-8'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        
        {/* LOGO SECTION - LINKORA */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 group z-[110]" onClick={() => setIsMenuOpen(false)}>
          <RotatingFanIcon>
            <div className="p-1.5 md:p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 group-hover:border-amber-500/50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 md:w-5 md:h-5">
                <path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z"/>
                <path d="M12 12v.01"/>
              </svg>
            </div>
          </RotatingFanIcon>
          <span className="text-xl md:text-2xl font-serif tracking-tighter text-white group-hover:text-amber-500 transition-colors uppercase italic">
            LINK<span className="font-light text-amber-500 not-italic">ORA</span>
          </span>
        </Link>

        {/* DESKTOP FLOATING MENU */}
        <div className="hidden lg:flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-2 py-1.5 absolute left-1/2 -translate-x-1/2 shadow-2xl">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 xl:px-5 py-2 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 ${
                  isActive ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.text}
              </Link>
            );
          })}
        </div>

        {/* RIGHT SECTION (PROFILE/LOGIN & MOBILE TOGGLE) */}
        <div className="flex items-center gap-3 md:gap-4 z-[110]">
          <div className="hidden sm:block">
            {isLoggedIn ? (
              <button onClick={handleProfileClick} className="p-1 border border-white/10 rounded-full hover:border-amber-500/50 transition-all">
                <FaUserCircle className="w-7 h-7 md:w-8 md:h-8 text-white/80 hover:text-amber-500 transition-colors" />
              </button>
            ) : (
              <Link to="/login" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] px-4 md:px-6 py-2 md:py-2.5 bg-white text-black rounded-xl hover:bg-amber-500 transition-colors">
                Sign In
              </Link>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-white/5 border border-white/10 rounded-xl hover:border-amber-500/50 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`w-5 h-0.5 bg-amber-500 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-5 h-0.5 bg-amber-500 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-amber-500 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-black/98 backdrop-blur-2xl z-[100] flex flex-col justify-center px-10 lg:hidden"
          >
            <div className="space-y-6 md:space-y-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link 
                    to={link.to} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-4xl md:text-5xl font-serif text-white hover:text-amber-500 transition-colors flex items-center gap-4 group"
                  >
                    <span className="text-[10px] font-mono text-amber-500 opacity-50 group-hover:opacity-100">0{i+1}</span>
                    {link.text}
                  </Link>
                </motion.div>
              ))}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.4 }}
                className="pt-10 border-t border-white/10 mt-4"
              >
                {isLoggedIn ? (
                  <button onClick={handleProfileClick} className="text-amber-500 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                    <FaUserCircle className="text-2xl" /> View Profile
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-amber-500 font-bold uppercase tracking-[0.2em] text-xs">
                    Access Linkora (Login)
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