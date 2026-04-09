import React from 'react';
import useSEO from '../hooks/useSEO';
import { motion } from 'framer-motion';
import { FiUsers, FiMessageSquare, FiSearch, FiBookOpen, FiArrowRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from './Footer';

const Reveal = ({ children, delay = 0, className = '' }) => {
  const { useRef } = React;
  const ref = useRef(null);
  // Simple fade-in on mount (no scroll needed for static cards)
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
};

const About = () => {
  useSEO({
    title: 'About',
    description: 'Learn about Linkaura — a community platform where students and developers connect, chat, and grow together.',
    keywords: 'about linkaura, community platform, developer networking, student community',
  });

  const cards = [
    { icon: FiUsers,        title: 'Who We Are',        text: 'Linkaura is a community platform built for students, developers, and creators. We bring people together so you can find others who share your interests, tech stack, and goals — without the noise.' },
    { icon: FiSearch,       title: 'Discover Profiles', text: 'Browse real profiles of people in our community. Filter by tech stack, location, and year. Every profile is someone you can actually reach out to and collaborate with.' },
    { icon: FiMessageSquare,title: 'Chat Directly',     text: 'Found someone interesting? Message them directly on the platform — no middlemen, no email required. Just a simple real-time conversation to start building something together.' },
    { icon: FiBookOpen,     title: 'Learn Together',    text: 'We curate top educators in development and design so you always know where to learn next. From DSA to full stack to AI — the community recommends the best resources.' },
  ];

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: "'Georgia', serif" }}>

      {/* Noise texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '128px',
      }} />

      <Navbar />

      {/* ── HERO ── */}
      <section className="relative border-b border-black/10 overflow-hidden pt-28">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
        <div className="relative z-10 px-6 md:px-12 py-16 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-black/15 text-[10px] font-black uppercase tracking-[0.4em] text-black/50 mb-8" style={{ fontFamily: 'sans-serif' }}>
              About / 01
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-7xl md:text-[5.5rem] font-serif font-bold leading-[0.92] tracking-tight text-black mb-6">
            Link<span className="italic">aura.</span><br />Where Builders<br />Meet.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-black/50 max-w-lg leading-relaxed border-l-4 border-black/15 pl-5" style={{ fontFamily: 'sans-serif', fontWeight: 400 }}>
            “We built Linkaura because finding the right people to learn and build with shouldn’t be hard.”
          </motion.p>
        </div>
      </section>

      {/* ── CARDS ── */}
      <section className="border-b border-black/8 py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/8">
            {cards.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="bg-white p-8 group hover:bg-black transition-all duration-300 h-full">
                  <div className="w-10 h-10 border-2 border-black group-hover:border-white flex items-center justify-center mb-5 transition-colors">
                    <Icon size={16} className="group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-black group-hover:text-white mb-3 transition-colors">{title}</h3>
                  <p className="text-sm text-black/50 group-hover:text-white/50 leading-relaxed transition-colors" style={{ fontFamily: 'sans-serif' }}>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER NOTE ── */}
      <section className="py-12 px-6 md:px-12 border-b border-black/8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/25" style={{ fontFamily: 'sans-serif' }}>EST. 2026 · Linkaura Community Platform</p>
          <FiArrowRight size={14} className="text-black/20" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
