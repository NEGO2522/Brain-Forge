import React, { useState, createContext, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { RotatingFanIcon } from './RotatingFanIcon';
import { FaUserCircle, FaBell, FaComments } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export const MenuContext = createContext({ isMenuOpen: false, setIsMenuOpen: () => {} });

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
  const [isLoggedIn,  setIsLoggedIn]  = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate  = useNavigate();
  const location  = useLocation();

  // Check if we're on the user profile page with an incomplete profile
  const isOnUserPage = location.pathname === '/user';
  const [profileLocked, setProfileLocked] = useState(false);

  useEffect(() => {
    if (!isOnUserPage) { setProfileLocked(false); return; }
    // Check if profile is complete by querying Supabase
    const checkProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from('user_profiles')
        .select('name, email, address, github, linkedin, tech_stack, year')
        .eq('user_id', session.user.id)
        .single();
      if (!data) { setProfileLocked(true); return; }
      const allFilled = Object.values(data).every(v => v && String(v).trim());
      setProfileLocked(!allFilled);
    };
    checkProfile();
  }, [isOnUserPage]);

  // Guard navigation — block all nav when profile is locked
  const guardedNavigate = (path) => {
    if (profileLocked) return; // do nothing
    navigate(path);
    setIsMenuOpen(false);
  };

  /* ── Auth + unread notification count ── */
  useEffect(() => {
    let notifChannel = null;

    const setupNotifs = async (userId) => {
      if (!userId) { setUnreadCount(0); return; }

      // Initial count
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);
      setUnreadCount(count || 0);

      // Realtime subscription
      notifChannel = supabase
        .channel(`navbar-notifs:${userId}`)
        .on('postgres_changes', {
          event: '*', schema: 'public', table: 'notifications',
          filter: `user_id=eq.${userId}`,
        }, async () => {
          const { count: newCount } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('read', false);
          setUnreadCount(newCount || 0);
        })
        .subscribe();
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user);
      setupNotifs(session?.user?.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session?.user);
      if (notifChannel) { supabase.removeChannel(notifChannel); notifChannel = null; }
      setupNotifs(session?.user?.id);
    });

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      subscription.unsubscribe();
      if (notifChannel) supabase.removeChannel(notifChannel);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024) setIsMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMenuOpen]);

  const handleProfileClick     = () => guardedNavigate('/user');
  const handleNotificationClick = () => guardedNavigate('/notification');
  const handleChatsClick       = () => guardedNavigate('/chats');

  // Wrap Link clicks to block navigation when locked
  const handleNavLinkClick = (e) => {
    if (profileLocked) e.preventDefault();
    else setIsMenuOpen(false);
  };

  const navLinks = [
    { to: '/',          text: 'Home'      },
    { to: '/profiles',  text: 'Profiles'  },
    { to: '/educators', text: 'Educators' },
  ];

  const scrolledBg = 'bg-black backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 md:px-8 ${
      scrolled ? `py-3 ${scrolledBg}` : 'py-5 md:py-8 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 group z-[110]" onClick={(e) => { if (profileLocked) { e.preventDefault(); return; } setIsMenuOpen(false); }}>
          <RotatingFanIcon>
            <div className="p-1.5 md:p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 group-hover:border-amber-500/50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 md:w-5 md:h-5">
                <path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z"/>
                <path d="M12 12v.01"/>
              </svg>
            </div>
          </RotatingFanIcon>
          <span className="text-lg md:text-2xl font-serif tracking-tighter group-hover:text-amber-500 transition-colors uppercase italic" style={{ color: '#ffffff' }}>
            LINK<span className="font-light text-amber-500 not-italic">AURA</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center backdrop-blur-md border rounded-2xl px-2 py-1.5 absolute left-1/2 -translate-x-1/2 shadow-2xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.10)' }}>
          {navLinks.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to}
                onClick={handleNavLinkClick}
                className={`px-4 xl:px-5 py-2 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 ${
                  isActive ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.6)] ring-2 ring-amber-500/50' : ''
                } ${profileLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                style={!isActive ? { color: '#9ca3af' } : {}}>
                {link.text}
              </Link>
            );
          })}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 md:gap-4 z-[110]">
          {isLoggedIn ? (
            <>
              <button onClick={handleChatsClick}
                className="hidden md:block p-1 border rounded-full hover:border-amber-500/50 transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
                <FaComments className="w-6 h-6 md:w-7 md:h-7 hover:text-amber-500 transition-colors" style={{ color: 'rgba(255,255,255,0.80)' }} />
              </button>
              <button onClick={handleNotificationClick}
                className="hidden md:block relative p-1 border rounded-full hover:border-amber-500/50 transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
                <FaBell className="w-6 h-6 md:w-7 md:h-7 hover:text-amber-500 transition-colors" style={{ color: 'rgba(255,255,255,0.80)' }} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-amber-500 rounded-full border-2 border-black flex items-center justify-center text-black text-[9px] font-black px-0.5">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <button onClick={handleProfileClick}
                className="hidden md:block p-1 border rounded-full hover:border-amber-500/50 transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
                <FaUserCircle className="w-7 h-7 md:w-8 md:h-8 hover:text-amber-500 transition-colors" style={{ color: 'rgba(255,255,255,0.80)' }} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 md:gap-3">
              <Link to="/login"
                className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] px-3 md:px-6 py-2 md:py-2.5 rounded-xl border border-white/20 hover:border-amber-400/60 transition-colors whitespace-nowrap"
                style={{ color: '#ffffff' }}>
                Sign In
              </Link>
              <Link to="/signup"
                className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] px-3 md:px-6 py-2 md:py-2.5 rounded-xl hover:bg-amber-400 transition-colors whitespace-nowrap"
                style={{ backgroundColor: '#f59e0b', color: '#000000' }}>
                Get Started
              </Link>
            </div>
          )}

          {/* HAMBURGER */}
          <button
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center border rounded-xl hover:border-amber-500/50 transition-all cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.10)' }}
            onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
            <div className="flex flex-col gap-1.5">
              <div className={`w-5 h-0.5 bg-amber-500 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <div className={`w-5 h-0.5 bg-amber-500 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <div className={`w-5 h-0.5 bg-amber-500 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 w-full h-[100dvh] z-[105] flex flex-col lg:hidden"
            style={{ backgroundColor: '#000000' }}>
            <div className="flex flex-col h-full justify-center px-8 sm:px-12">
              <div className="space-y-6">
                {navLinks.map((link, i) => (
                  <motion.div key={link.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link to={link.to} onClick={handleNavLinkClick}
                      className={`text-4xl sm:text-5xl font-serif hover:text-amber-500 transition-colors flex items-center gap-4 group ${profileLocked ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
                      style={{ color: '#ffffff' }}>
                      <span className="text-[10px] font-mono text-amber-500/50">0{i + 1}</span>
                      {link.text}
                    </Link>
                  </motion.div>
                ))}

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="pt-10 border-t mt-6" style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
                  {isLoggedIn ? (
                    <div className="space-y-4">
                      <button onClick={handleChatsClick} className="text-amber-500 font-bold uppercase tracking-widest text-xs flex items-center gap-3 w-full">
                        <FaComments className="text-xl" /> Chats
                      </button>
                      <button onClick={handleNotificationClick} className="text-amber-500 font-bold uppercase tracking-widest text-xs flex items-center gap-3 w-full">
                        <FaBell className="text-xl" /> Notifications
                      </button>
                      <button onClick={handleProfileClick} className="text-amber-500 font-bold uppercase tracking-widest text-xs flex items-center gap-3">
                        <FaUserCircle className="text-xl" /> View Account
                      </button>
                    </div>
                  ) : (
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-amber-500 font-bold uppercase tracking-widest text-xs">
                      Join the Network &rarr;
                    </Link>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
