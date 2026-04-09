import React from 'react';
import useSEO from '../hooks/useSEO';
import { motion } from 'framer-motion';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FiMail, FiMapPin, FiPhone, FiArrowRight, FiUsers, FiMessageSquare, FiSearch } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from './Footer';

const Connect = () => {
  useSEO({
    title: 'Connect',
    description: 'Get in touch with the Linkaura community and follow us on social media.',
    keywords: 'connect linkaura, contact us, community, instagram, linkedin',
  });

  const INSTAGRAM_LINK = "https://instagram.com/brainforge";
  const LINKEDIN_LINK  = "https://www.linkedin.com/company/brainforge16";

  const noiseBg = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat', backgroundSize: '128px',
  };

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: "'Georgia', serif" }}>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]" style={noiseBg} />

      <Navbar />

      {/* HERO */}
      <section className="relative border-b border-black/10 overflow-hidden pt-28">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
        <div className="relative z-10 px-6 md:px-12 py-16 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-black/15 text-[10px] font-black uppercase tracking-[0.4em] text-black/50 mb-8" style={{ fontFamily: 'sans-serif' }}>
              Get in Touch
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-7xl md:text-[5.5rem] font-serif font-bold leading-[0.92] tracking-tight text-black mb-6">
            Connect<br />With Us.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-black/50 max-w-md leading-relaxed" style={{ fontFamily: 'sans-serif', fontWeight: 400 }}>
            A community platform for students, developers, and creators to find each other, chat, and build together.
          </motion.p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="border-b border-black/8 py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-px bg-black/8">

          {/* LEFT — contact info */}
          <div className="bg-white p-10 flex flex-col gap-8" style={{ fontFamily: 'sans-serif' }}>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-6">Contact</p>
              <div className="flex flex-col gap-5">
                {[
                  { icon: FiMapPin, label: 'Location',     value: 'Jaipur, Rajasthan', href: null },
                  { icon: FiMail,   label: 'Email',        value: 'nextgenova28@gmail.com', href: 'mailto:nextgenova28@gmail.com' },
                  { icon: FiPhone,  label: 'Phone',        value: '+91 94139 73399', href: 'tel:+919413973399' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-9 h-9 border border-black/15 flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-black/40" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.3em] font-black text-black/30 mb-0.5">{label}</p>
                      {href
                        ? <a href={href} className="text-sm text-black hover:text-black/60 transition-colors">{value}</a>
                        : <p className="text-sm text-black/70">{value}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.4em] font-black text-black/30 mb-4">Follow Us</p>
              <div className="flex gap-2">
                <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 border border-black/15 flex items-center justify-center text-black/40 hover:bg-black hover:text-white hover:border-black transition-all duration-200">
                  <FaInstagram size={14} />
                </a>
                <a href={LINKEDIN_LINK} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 border border-black/15 flex items-center justify-center text-black/40 hover:bg-black hover:text-white hover:border-black transition-all duration-200">
                  <FaLinkedin size={14} />
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="border border-black/10 overflow-hidden h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.3825624311!2d75.65047033534571!3d26.88544791845112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adb4ad85659%3A0x139059bc57d0ad61!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%" height="100%"
                style={{ border: 0, filter: 'grayscale(1) contrast(1.1)' }}
                allowFullScreen="" loading="lazy" title="Jaipur Map"
              />
            </div>
          </div>

          {/* RIGHT — platform info */}
          <div className="bg-white p-10 flex flex-col gap-8" style={{ fontFamily: 'sans-serif' }}>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-3">Platform</p>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-black flex items-center justify-center">
                  <span className="text-white text-[10px] font-black">L</span>
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-[0.2em] text-black leading-none">Linkaura</h2>
                  <span className="text-[9px] uppercase tracking-[0.3em] font-black text-black/35">Community Platform</span>
                </div>
                <div className="ml-auto flex items-center gap-1.5 border border-black/15 px-3 py-1">
                  <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-black/50">Live</span>
                </div>
              </div>
              <p className="text-sm text-black/50 leading-relaxed border-l-4 border-black/10 pl-4">
                A community platform for students, developers, and creators to find each other, chat, and build together.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-px bg-black/8">
              {[{ value: '200+', label: 'Members' }, { value: '99.9%', label: 'Uptime' }].map(({ value, label }) => (
                <div key={label} className="bg-white px-5 py-4">
                  <p className="text-3xl font-serif font-bold text-black leading-none">{value}</p>
                  <p className="text-[9px] uppercase tracking-[0.3em] font-black text-black/30 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="flex flex-col gap-px bg-black/8">
              {[
                { icon: FiSearch,       label: 'Browse Profiles'   },
                { icon: FiMessageSquare,label: 'Real-time Chat'     },
                { icon: FiUsers,        label: 'Community Events'   },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="bg-white flex items-center gap-4 px-5 py-3 group hover:bg-black transition-all duration-200">
                  <div className="w-7 h-7 border border-black/15 group-hover:border-white flex items-center justify-center flex-shrink-0 transition-colors">
                    <Icon size={12} className="text-black/40 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-black text-black/50 group-hover:text-white transition-colors">{label}</span>
                </div>
              ))}
            </div>

            {/* Roadmap */}
            <div className="border border-black/10 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[9px] uppercase tracking-[0.3em] font-black text-black/40">Roadmap</p>
                <span className="text-[9px] font-black uppercase tracking-widest text-black/40 border border-black/15 px-2 py-0.5">Phase 02</span>
              </div>
              <div className="w-full h-1 bg-black/8 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} whileInView={{ width: '65%' }} viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full bg-black"
                />
              </div>
            </div>

            <a href={LINKEDIN_LINK} target="_blank" rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-black text-white text-[11px] font-black uppercase tracking-widest hover:bg-black/80 transition-all">
              Join Linkaura
              <FiArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Connect;
